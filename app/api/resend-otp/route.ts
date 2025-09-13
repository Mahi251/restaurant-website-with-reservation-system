import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { reservationId } = await request.json()

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get the reservation
    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", reservationId)
      .single()

    if (fetchError || !reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    // Check if we can resend (limit to once per minute)
    const lastOtpTime = new Date(reservation.otp_created_at)
    const now = new Date()
    const timeDiff = now.getTime() - lastOtpTime.getTime()
    const minutesDiff = timeDiff / (1000 * 60)

    if (minutesDiff < 1) {
      return NextResponse.json({ error: "Please wait before requesting a new code" }, { status: 429 })
    }

    // Generate new OTP
    const newOtp = generateOTP()

    // Update reservation with new OTP
    const { error: updateError } = await supabase
      .from("reservations")
      .update({
        otp_code: newOtp,
        otp_created_at: new Date().toISOString(),
      })
      .eq("id", reservationId)

    if (updateError) {
      console.error("Error updating OTP:", updateError)
      return NextResponse.json({ error: "Failed to generate new code" }, { status: 500 })
    }

    // In a real application, you would send the OTP via SMS here
    console.log(`[v0] New OTP for reservation ${reservationId}: ${newOtp}`)

    return NextResponse.json({
      success: true,
      message: "New verification code sent",
    })
  } catch (error) {
    console.error("Error resending OTP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
