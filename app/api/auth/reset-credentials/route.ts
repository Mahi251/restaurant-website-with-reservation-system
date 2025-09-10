import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { secretCode, newUsername, newPassword } = await request.json()

    if (!secretCode) {
      return NextResponse.json({ error: "Secret code is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Call the reset_admin_credentials function
    const { data, error } = await supabase.rpc("reset_admin_credentials", {
      secret_code_input: secretCode,
      new_username: newUsername || null,
      new_password: newPassword || null,
    })

    if (error) {
      console.error("Reset error:", error)
      return NextResponse.json({ error: "Reset failed" }, { status: 500 })
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: data?.message || "Credentials updated successfully",
    })
  } catch (error) {
    console.error("Reset credentials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
