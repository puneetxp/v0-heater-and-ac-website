import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function checkAdminAccess() {
  try {
    const supabase = await createServerClient();
    const cookieStore = await cookies();

    const { data, error: authError } = await supabase.auth.getUser();
    const user = data?.user;

    // Check if this is a Supabase authenticated user
    if (user && !authError) {
      try {
        const { data: profile } = await supabase.from("profiles").select("role")
          .eq("id", user.id).single();

        if (profile?.role === "admin") {
          return { user, profile };
        }
      } catch (err) {
        console.error("[v0] profile check failed:", err);
      }
    }

    // Check for static admin session in cookies
    const adminSessionCookie = cookieStore.get("admin_session");
    if (adminSessionCookie) {
      try {
        const session = JSON.parse(adminSessionCookie.value);
        if (session.id === "static-admin" && session.role === "admin") {
          return {
            user: { id: "static-admin", email: session.email },
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
