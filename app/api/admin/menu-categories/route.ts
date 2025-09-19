import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {

  try {
    const supabase = await createServerClient();

    // Use a join to fetch menu items and their corresponding category names.
    const { data: menuItems, error } = await supabase
      .from("menu_items")
      .select(`
        *, 
        menu_categories (
          name
        )
      `);

    if (error) {
      console.error("Error fetching menu items:", error);
      return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
    }

    // Format the data to make it easier to use on the frontend.
    const formattedItems = menuItems.map(item => ({
      ...item,
      category_name: item.menu_categories.name
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}