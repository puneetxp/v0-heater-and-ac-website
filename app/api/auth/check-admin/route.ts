import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get("admin_session")

    if (!adminSession) {
      console.log("[v0] No admin_session cookie found")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      const session = JSON.parse(adminSession.value)
      console.log("[v0] Parsed session:", { id: session.id, role: session.role })
      
      if (session.id === "static-admin" && session.role === "admin") {
        console.log("[v0] Auth check passed")
        return NextResponse.json({ authenticated: true }, { status: 200 })
      }
      
      console.log("[v0] Session validation failed - invalid id or role")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    } catch (e) {
      console.error("[v0] Failed to parse session:", e)
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Error checking admin:", error)
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 })
  }
}
