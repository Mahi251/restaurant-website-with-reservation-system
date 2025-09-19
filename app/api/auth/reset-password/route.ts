import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Only allow password reset for the specific admin email
    if (email !== "genet@ithiopica.eatery") {
      return NextResponse.json({ error: "Password reset not available for this email" }, { status: 403 })
    }

    const supabase = createClient()

    // Use Supabase's built-in password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/auth/reset-password-confirm`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email sent to Mahiimran2049@gmail.com",
    })
  } catch (error) {length
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
