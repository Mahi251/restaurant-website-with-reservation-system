import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const supabase = await createServerClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch reservations within date range (include time and fields needed for aggregates)
    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("id, customer_name, party_size, reservation_date, reservation_time, status, created_at")
      .gte("reservation_date", startDate.toISOString().split("T")[0])
      .lte("reservation_date", endDate.toISOString().split("T")[0])

    if (error) {
      console.error("Error fetching analytics data:", error)
      return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
    }

    const safeReservations = reservations || []

    // Totals and averages
    const totalReservations = safeReservations.length
    const totalGuests = safeReservations.reduce((sum, r) => sum + (Number(r.party_size) || 0), 0)
    const avgPartySize = totalReservations > 0 ? totalGuests / totalReservations : 0

    // Peak hours (group by hour string like "18:00")
    const hourCounts: Record<string, number> = {}
    for (const r of safeReservations) {
      const timeStr: string | null = (r as any).reservation_time || null
      if (!timeStr) continue
      // Normalize to HH:MM
      const hourKey = typeof timeStr === "string" ? timeStr.slice(0, 5) : new Date(`1970-01-01T${timeStr}Z`).toISOString().slice(11, 16)
      hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1
    }
    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)

    // Popular days (group by weekday name)
    const dayCounts: Record<string, number> = {}
    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    for (const r of safeReservations) {
      const dateVal = new Date(r.reservation_date as unknown as string)
      const dayName = weekdayNames[dateVal.getUTCDay()]
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1
    }
    const popularDays = Object.entries(dayCounts)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => b.count - a.count)

    // Recent reservations (latest by created_at)
    const recentReservations = [...safeReservations]
      .sort((a, b) => new Date(b.created_at as unknown as string).getTime() - new Date(a.created_at as unknown as string).getTime())
      .slice(0, 10)
      .map((r) => ({
        id: r.id as string,
        customer_name: r.customer_name as string,
        party_size: Number(r.party_size) || 0,
        reservation_date: r.reservation_date as unknown as string,
        status: r.status as string,
      }))

    return NextResponse.json({
      totalReservations,
      totalGuests,
      avgPartySize,
      peakHours,
      popularDays,
      recentReservations,
    })
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
