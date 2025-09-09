import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { data: reservation, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", params.id)
      .eq("status", "confirmed")
      .single()

    if (error || !reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
