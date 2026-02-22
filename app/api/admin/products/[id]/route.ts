import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAccess } from "@/lib/check-admin";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    // Check admin access
    try {
        await checkAdminAccess();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, price_per_month, description, is_available, image_url } =
        body;

    // Validate
    if (!name || !price_per_month) {
        return NextResponse.json(
            { error: "name and price_per_month are required" },
            { status: 400 },
        );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .update({
            name,
            price_per_month: Number(price_per_month),
            description: description || null,
            is_available: Boolean(is_available),
            ...(image_url !== undefined ? { image_url } : {}),
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
