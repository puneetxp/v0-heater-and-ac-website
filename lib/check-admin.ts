import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function checkAdminAccess() {
  try {
    const cookieStore = await cookies();

    // Check for secure httpOnly admin session cookie
    const adminSessionCookie = cookieStore.get("admin_session");
    if (adminSessionCookie) {
      try {
        const session = JSON.parse(adminSessionCookie.value);
        if (session.id === "admin" && session.role === "admin") {
          return {
            user: { id: "admin", email: session.email },
            profile: { role: "admin" },
          };
        }
      } catch (e) {
        console.error("[v0] Failed to parse admin session:", e);
      }
    }
  } catch (globalError) {
    console.error("[v0] Global auth check failed:", globalError);
  }

  // Not authorized
  redirect("/admin/login");
}
