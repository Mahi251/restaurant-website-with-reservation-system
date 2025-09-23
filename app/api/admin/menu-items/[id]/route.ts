import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      .update({
        name,
        description,
        price,
        is_available: is_available ?? true,
        is_featured: is_featured ?? false,
        allergens: allergens || [],
        dietary_info: dietary_info || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating menu item:", error)
      return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
    }

    // Add category name to response
    const menuItemWithCategory = {
      ...menuItem,
      category,
    }

    return NextResponse.json(menuItemWithCategory)
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { data: categories } = await supabase.from("menu_categories").select("name")

    let itemDeleted = false

    // Search through all category tables to find and delete the item
    for (const category of categories || []) {
      const tableName = `menu_${category.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`

      try {
        const { error } = await supabase.from(tableName).delete().eq("id", params.id)

        if (!error) {
          itemDeleted = true
          break
        }
      } catch (error) {
        // Continue searching in other tables
        continue
      }
    }

    if (!itemDeleted) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
