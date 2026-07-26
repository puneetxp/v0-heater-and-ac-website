import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    // Get admin client
    const adminClient = createAdminClient()
    if (!adminClient) {
      console.error("[v0] Failed to create admin client")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Query admin_users table
    const { data: adminUser, error: queryError } = await adminClient
      .from("admin_users")
      .select("id, email, password_hash, is_active")
      .eq("email", email.toLowerCase())
      .single()

    if (queryError || !adminUser) {
      console.error("[v0] Admin user not found:", queryError)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check if admin is active
    if (!adminUser.is_active) {
      return NextResponse.json(
        { error: "This admin account has been deactivated" },
        { status: 403 }
      )
    }

    // Verify password hash
    const passwordMatch = await bcrypt.compare(password, adminUser.password_hash)
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Create secure httpOnly cookie (cannot be accessed from JavaScript)
    const cookieStore = await cookies()
    const adminSession = {
      id: adminUser.id,
      email: adminUser.email,
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
