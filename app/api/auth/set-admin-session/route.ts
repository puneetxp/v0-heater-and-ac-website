import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate admin session data
    if (body.id !== "static-admin" || body.role !== "admin") {
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 })
    }

    const cookieStore = await cookies()

    // Set the admin_session cookie
    cookieStore.set("admin_session", JSON.stringify(body), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error setting admin session:", error)
    return NextResponse.json({ error: "Failed to set admin session" }, { status: 500 })
  }
}
