import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    // Verify admin credentials against environment variables (server-side only)
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error("[v0] Admin credentials not configured in environment")
      return NextResponse.json(
        { error: "Admin authentication not configured" },
        { status: 500 }
      )
    }

    // Check credentials
    if (email.toLowerCase().trim() !== adminEmail.toLowerCase() || password !== adminPassword) {
      // Don't reveal which part is wrong for security
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Create secure httpOnly cookie (cannot be accessed from JavaScript)
    const cookieStore = await cookies()
    const adminSession = {
      id: "admin",
      email: email,
      role: "admin",
      loginTime: new Date().toISOString(),
    }

    cookieStore.set("admin_session", JSON.stringify(adminSession), {
      httpOnly: true, // Cannot be accessed from client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
      sameSite: "lax", // CSRF protection
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error("[v0] Admin verification error:", error)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}
