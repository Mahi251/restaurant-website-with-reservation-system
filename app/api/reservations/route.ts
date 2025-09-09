import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      customer_name,
      customer_email,
      customer_phone,
      party_size,
      reservation_date,
      reservation_time,
      special_requests,
    } = body

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !party_size || !reservation_date || !reservation_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // Create reservation
    const { data: reservation, error } = await supabase
      .from("reservations")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        party_size: Number.parseInt(party_size),
        reservation_date,
        reservation_time,
        special_requests: special_requests || null,
        otp_code: otpCode,
        otp_expires_at: otpExpiresAt.toISOString(),
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
    }

    // TODO: Send OTP email (will be implemented in the next task)
    console.log(`OTP for reservation ${reservation.id}: ${otpCode}`)

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        customer_name: reservation.customer_name,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
