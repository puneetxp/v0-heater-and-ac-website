import { type NextRequest, NextResponse } from "next/server"
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

    // Check if any admin users already exist
    const { data: existingAdmins, error: checkError } = await adminClient
      .from("admin_users")
      .select("id")
      .limit(1)

    if (checkError) {
      console.error("[v0] Error checking admin users:", checkError)
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      )
    }

    // Only allow creation if no admins exist (first admin only)
    if (existingAdmins && existingAdmins.length > 0) {
      console.warn("[v0] Attempted to create admin when one already exists")
      return NextResponse.json(
        { error: "Admin user already exists. Use the login page to access your account." },
        { status: 403 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create first admin user
    const { data: newAdmin, error: createError } = await adminClient
      .from("admin_users")
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: hashedPassword,
          is_active: true,
        },
      ])
      .select("id, email")
      .single()

    if (createError || !newAdmin) {
      console.error("[v0] Error creating admin user:", createError)
      return NextResponse.json(
        { error: "Failed to create admin user. Email may already be registered." },
        { status: 500 }
      )
    }

    console.log("[v0] First admin user created:", newAdmin.email)
    return NextResponse.json({
      success: true,
      message: "Admin user created successfully. You can now log in.",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
      },
    })
  } catch (error) {
    console.error("[v0] Admin initialization error:", error)
    return NextResponse.json(
      { error: "Initialization failed" },
      { status: 500 }
    )
  }
}
