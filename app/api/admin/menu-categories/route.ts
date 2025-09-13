import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Get distinct categories from menu_items table
    const { data: categories, error } = await supabase.from("menu_items").select("category").not("category", "is", null)

    if (error) {
      console.error("Error fetching menu categories:", error)
      return NextResponse.json({ error: "Failed to fetch menu categories" }, { status: 500 })
    }

    // Extract unique categories
    const uniqueCategories = [...new Set(categories?.map((item) => item.category) || [])]

    // Return categories in the expected format
    const formattedCategories = uniqueCategories.map((category) => ({
      id: category,
      name: category,
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("Error fetching menu categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
