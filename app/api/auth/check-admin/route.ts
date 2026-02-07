import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get("admin_session")

    if (!adminSession) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      const session = JSON.parse(adminSession.value)
      if (session.id === "static-admin" && session.role === "admin") {
        return NextResponse.json({ authenticated: true })
      }
    } catch (e) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    console.error("[v0] Error checking admin:", error)
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 })
  }
}
