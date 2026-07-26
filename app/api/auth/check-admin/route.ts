import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Check for secure httpOnly admin cookie
    const adminSession = cookieStore.get("admin_session")
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession.value)
        if (session.id === "admin" && session.role === "admin") {
          return NextResponse.json({ authenticated: true })
        }
      } catch (e) {
        console.error("[v0] Failed to parse admin session cookie:", e)
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    console.error("[v0] Global error in check-admin API:", error)
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 })
  }
}
