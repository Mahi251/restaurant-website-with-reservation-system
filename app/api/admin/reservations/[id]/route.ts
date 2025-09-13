import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const supabase = await createServerClient()

    const { error } = await supabase.from("reservations").update({ status }).eq("id", params.id)

    if (error) {
      console.error("Error updating reservation:", error)
      return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("reservations").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting reservation:", error)
      return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
