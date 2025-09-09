import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { reservationId, otp } = await request.json()

    if (!reservationId || !otp) {
      return NextResponse.json({ error: "Reservation ID and OTP are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get the reservation with OTP details
    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", reservationId)
      .eq("otp_code", otp)
      .single()

    if (fetchError || !reservation) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Check if OTP has expired (10 minutes)
    const otpCreatedAt = new Date(reservation.otp_created_at)
    const now = new Date()
    const timeDiff = now.getTime() - otpCreatedAt.getTime()
    const minutesDiff = timeDiff / (1000 * 60)

    if (minutesDiff > 10) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 })
    }

    // Verify and confirm the reservation
    const { error: updateError } = await supabase
      .from("reservations")
      .update({
        status: "confirmed",
        otp_verified: true,
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", reservationId)

    if (updateError) {
      console.error("Error confirming reservation:", updateError)
      return NextResponse.json({ error: "Failed to confirm reservation" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Reservation confirmed successfully",
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
