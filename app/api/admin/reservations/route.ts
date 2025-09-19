import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reservations:", error)
      return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
    }

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}