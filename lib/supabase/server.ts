import { createServerClient as createServerClientBase } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[v0] Supabase environment variables are missing in Server Component",
      );
    }
    // Return a dummy client or handle it safely to avoid crashing the whole render
    // Most operations will fail but at least the initial render might survive or show a better error
  }

  return createServerClientBase(url || "", key || "", {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have proxy refreshing user sessions.
        }
      },
    },
  });
}

export const createClient = createServerClient;
