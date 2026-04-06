import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        console.warn("[v0] Supabase Service Role Key is missing. Admin operations may fail.");
        // Fallback to normal client if service role is missing (might fail due to RLS)
        return null;
    }

    return createClient(url, serviceRoleKey);
}
