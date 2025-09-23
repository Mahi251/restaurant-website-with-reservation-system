import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: menuItems, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        menu_categories!inner(
          name,
          display_order
        )
      `)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching menu items:", error)
      return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
    }

    // Transform the data to include category name
    const transformedItems =
      menuItems?.map((item) => ({
        ...item,
        category: item.menu_categories.name,
      })) || []

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category_id, is_available, is_featured, allergens, dietary_info, image_url } =
      body

    if (!category_id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: menuItem, error } = await supabase
      .from("menu_items")
      .insert([
        {
          name,
          description,
          price,
          category_id,
          image_url,
          is_available: is_available ?? true,
          is_featured: is_featured ?? false,
          allergens: allergens || [],
          dietary_info: dietary_info || [],
        },
      ])
      .select(`
        *,
        menu_categories!inner(name)
      `)
      .single()

    if (error) {
      console.error("Error creating menu item:", error)
      return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
    }

    // Transform response to include category name
    const menuItemWithCategory = {
      ...menuItem,
      category: menuItem.menu_categories.name,
    }

    return NextResponse.json(menuItemWithCategory)
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
