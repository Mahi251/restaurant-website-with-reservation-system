import { type NextRequest, NextResponse } from "next/server"

const ADMIN_USERNAME = "genet@ithiopica.eatery"
const ADMIN_PASSWORD = "adminpassword.ithiopica"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Received login attempt:")
    console.log("[v0] Username received:", JSON.stringify(username))
    console.log("[v0] Password received:", JSON.stringify(password))
    console.log("[v0] Expected username:", JSON.stringify(ADMIN_USERNAME))
    console.log("[v0] Expected password:", JSON.stringify(ADMIN_PASSWORD))
    console.log("[v0] Username match:", username === ADMIN_USERNAME)
    console.log("[v0] Password match:", password === ADMIN_PASSWORD)

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log("[v0] Login successful!")
      return NextResponse.json({
        success: true,
        username: ADMIN_USERNAME,
      })
    } else {
      console.log("[v0] Login failed - credentials don't match")
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
