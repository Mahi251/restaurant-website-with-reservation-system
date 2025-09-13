import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: menuItems, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("category", { ascending: true })

    if (error) {
      console.error("Error fetching menu items:", error)
      return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
    }

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, image_url } = body

    const supabase = await createServerClient()

    const { data: menuItem, error } = await supabase
      .from("menu_items")
      .insert([{ name, description, price, category, image_url }])
      .select()
      .single()

    if (error) {
      console.error("Error creating menu item:", error)
      return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
