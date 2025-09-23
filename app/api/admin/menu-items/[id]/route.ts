import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, price, category_id, is_available, is_featured, allergens, dietary_info, image_url } =
      body

    if (!category_id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: menuItem, error } = await supabase
      .from("menu_items")
      .update({
        name,
        description,
        price,
        category_id,
        image_url,
        is_available: is_available ?? true,
        is_featured: is_featured ?? false,
        allergens: allergens || [],
        dietary_info: dietary_info || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select(`
        *,
        menu_categories!inner(name)
      `)
      .single()

    if (error) {
      console.error("Error updating menu item:", error)
      return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
    }

    // Transform response to include category name
    const menuItemWithCategory = {
      ...menuItem,
      category: menuItem.menu_categories.name,
    }

    return NextResponse.json(menuItemWithCategory)
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("menu_items").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting menu item:", error)
      return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
