import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, price, category, image_url } = body

    const supabase = await createServerClient()

    const { data: menuItem, error } = await supabase
      .from("menu_items")
      .update({ name, description, price, category, image_url })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating menu item:", error)
      return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
    }

    return NextResponse.json(menuItem)
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