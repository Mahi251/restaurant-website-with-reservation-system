import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

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
        const tableName = `menu_${category.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
        try {
          const { count } = await supabase.from(tableName).select("*", { count: "exact", head: true })

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
    const supabase = createServerClient()
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

    const tableName = `menu_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        allergens TEXT[],
        dietary_info TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Enable RLS
      ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;
      
      -- Create policies for the table
      CREATE POLICY "Allow all operations for authenticated users" ON ${tableName}
        FOR ALL USING (true);
    `

    const { error: tableError } = await supabase.rpc("execute_sql", {
      sql_query: createTableQuery,
    })

    if (tableError) {
      console.error("Error creating category table:", tableError)
      // Clean up the category if table creation failed
      await supabase.from("menu_categories").delete().eq("id", category.id)
      return NextResponse.json({ error: "Failed to create category table" }, { status: 500 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating menu category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
