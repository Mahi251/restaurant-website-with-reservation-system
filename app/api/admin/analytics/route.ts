import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const supabase = createServerClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch reservations within date range
    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("reservation_date, party_size, status")
      .gte("reservation_date", startDate.toISOString().split("T")[0])
      .lte("reservation_date", endDate.toISOString().split("T")[0])

    if (error) {
      console.error("Error fetching analytics data:", error)
      return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
    }

    // Process data for analytics
    const dailyReservations = reservations?.reduce((acc: any, reservation) => {
      const date = reservation.reservation_date
      if (!acc[date]) {
        acc[date] = { date, reservations: 0, guests: 0 }
      }
      acc[date].reservations += 1
      acc[date].guests += reservation.party_size
      return acc
    }, {})

    const analyticsData = Object.values(dailyReservations || {})

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
