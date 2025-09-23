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

    const { data: menuItems } = await supabase.from("menu_items").select("id")

    // Fetch average party size
    const { data: partySizes } = await supabase.from("reservations").select("party_size")

    const avgPartySize =
      partySizes && partySizes.length > 0 ? partySizes.reduce((sum, r) => sum + r.party_size, 0) / partySizes.length : 0

    return NextResponse.json({
      todayReservations: todayReservations?.length || 0,
      totalReservations: totalReservations?.length || 0,
      totalMenuItems: menuItems?.length || 0,
      avgPartySize: Math.round(avgPartySize * 10) / 10,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
