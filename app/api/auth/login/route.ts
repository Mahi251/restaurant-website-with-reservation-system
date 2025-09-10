import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Call the authenticate_admin function
    const { data, error } = await supabase.rpc("authenticate_admin", {
      input_username: username,
      input_password: password,
    })

    if (error) {
      console.error("Authentication error:", error)
      return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }

    if (!data?.valid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      username: data.username,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
