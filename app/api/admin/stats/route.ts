import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Get today's date
    const today = new Date().toISOString().split("T")[0]

    // Fetch today's reservations
    const { data: todayReservations } = await supabase.from("reservations").select("id").eq("reservation_date", today)

    // Fetch total reservations
    const { data: totalReservations } = await supabase.from("reservations").select("id")

    const { data: categories } = await supabase.from("menu_categories").select("name")

    let totalMenuItems = 0
    for (const category of categories || []) {
      const tableName = `menu_${category.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
      try {
        const { count } = await supabase.from(tableName).select("*", { count: "exact", head: true })
        totalMenuItems += count || 0
      } catch {
        // Continue if table doesn't exist
      }
    }

    // Fetch average party size
    const { data: partySizes } = await supabase.from("reservations").select("party_size")

    const avgPartySize =
      partySizes && partySizes.length > 0 ? partySizes.reduce((sum, r) => sum + r.party_size, 0) / partySizes.length : 0

    return NextResponse.json({
      todayReservations: todayReservations?.length || 0,
      totalReservations: totalReservations?.length || 0,
      totalMenuItems,
      avgPartySize: Math.round(avgPartySize * 10) / 10,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
