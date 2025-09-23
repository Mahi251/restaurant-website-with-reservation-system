import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { name, description } = await request.json()
    const { id } = params

    // Get the old category name to rename the table
    const { data: oldCategory } = await supabase.from("menu_categories").select("name").eq("id", id).single()

    if (!oldCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Update the category
    const { data, error } = await supabase
      .from("menu_categories")
      .update({ name, description })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If name changed, rename the table
    if (oldCategory.name !== name) {
      const oldTableName = `menu_${oldCategory.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
      const newTableName = `menu_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`

      await supabase.rpc("rename_table", {
        old_name: oldTableName,
        new_name: newTableName,
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { id } = params

    // Get the category name to drop the table
    const { data: category } = await supabase.from("menu_categories").select("name").eq("id", id).single()

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Drop the category table (this will delete all menu items in it)
    const tableName = `menu_${category.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
    await supabase.rpc("drop_table_if_exists", { table_name: tableName })

    // Delete the category
    const { error } = await supabase.from("menu_categories").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
