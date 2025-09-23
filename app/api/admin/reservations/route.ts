import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    console.log("[v0] Fetching reservations from database...")

    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error fetching reservations:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch reservations",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Successfully fetched reservations:", reservations?.length || 0)
    return NextResponse.json(reservations || [])
  } catch (error) {
    console.error("[v0] Unexpected error fetching reservations:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createServerClient()
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("reservations")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating reservation:", error)
      return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
