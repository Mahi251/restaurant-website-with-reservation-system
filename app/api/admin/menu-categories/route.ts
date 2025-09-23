import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: categories, error } = await supabase
      .from("menu_categories")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching menu categories:", error)
      return NextResponse.json({ error: "Failed to fetch menu categories" }, { status: 500 })
    }

    const categoriesWithCount = await Promise.all(
      (categories || []).map(async (category) => {
        try {
          const { count } = await supabase
            .from("menu_items")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)

          return {
            ...category,
            item_count: count || 0,
          }
        } catch {
          return {
            ...category,
            item_count: 0,
          }
        }
      }),
    )

    return NextResponse.json(categoriesWithCount)
  } catch (error) {
    console.error("Error fetching menu categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Get the highest display_order to append new category at the end
    const { data: lastCategory } = await supabase
      .from("menu_categories")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single()

    const nextDisplayOrder = (lastCategory?.display_order || 0) + 1

    const { data: category, error } = await supabase
      .from("menu_categories")
      .insert([
        {
          name,
          description: description || null,
          display_order: nextDisplayOrder,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating menu category:", error)
      return NextResponse.json({ error: "Failed to create menu category" }, { status: 500 })
    }

    // Categories are just metadata now, items reference them via category_id

    return NextResponse.json({
      ...category,
      item_count: 0,
    })
  } catch (error) {
    console.error("Error creating menu category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
