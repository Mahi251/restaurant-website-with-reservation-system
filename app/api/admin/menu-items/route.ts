import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: categories, error: categoriesError } = await supabase
      .from("menu_categories")
      .select("*")
      .order("display_order", { ascending: true })

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    // Fetch menu items from all category tables
    const allMenuItems = []

    for (const category of categories || []) {
      const tableName = `menu_${category.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`

      try {
        const { data: items, error } = await supabase.from(tableName).select("*").order("name", { ascending: true })

        if (!error && items) {
          // Add category name to each item
          const itemsWithCategory = items.map((item) => ({
            ...item,
            category: category.name,
          }))
          allMenuItems.push(...itemsWithCategory)
        }
      } catch (error) {
        console.error(`Error fetching items from ${tableName}:`, error)
        // Continue with other categories even if one fails
      }
    }

    return NextResponse.json(allMenuItems)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, is_available, is_featured, allergens, dietary_info } = body

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const tableName = `menu_${category.toLowerCase().replace(/[^a-z0-9]/g, "_")}`

    const { data: menuItem, error } = await supabase
      .from(tableName)
      .insert([
        {
          name,
          description,
          price,
          is_available: is_available ?? true,
          is_featured: is_featured ?? false,
          allergens: allergens || [],
          dietary_info: dietary_info || [],
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating menu item:", error)
      return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
    }

    // Add category name to response
    const menuItemWithCategory = {
      ...menuItem,
      category,
    }

    return NextResponse.json(menuItemWithCategory)
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
