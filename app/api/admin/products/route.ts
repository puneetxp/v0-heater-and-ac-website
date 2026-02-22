import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAccess } from "@/lib/check-admin";

export async function POST(req: NextRequest) {
    // Check admin access
    try {
        await checkAdminAccess();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, season, price_per_month, is_available, image_url } =
        body;

    // Validate
    if (!name || !category || !price_per_month) {
        return NextResponse.json(
            { error: "name, category, and price_per_month are required" },
            { status: 400 },
        );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .insert({
            name,
            category,
            season: season || "all",
            price_per_month: Number(price_per_month),
            is_available: is_available ?? true,
            image_url: image_url || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
