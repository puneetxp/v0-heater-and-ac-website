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

    // Reject blob URLs - they're temporary and cannot be persisted
    if (image_url && typeof image_url === "string" && image_url.startsWith("blob:")) {
        return NextResponse.json(
            { error: "Cannot save with temporary blob URL. Please upload an image first." },
            { status: 400 },
        );
    }

    // Get a privileged client for admin actions
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminClient = createAdminClient();
    const supabase = adminClient || (await createClient());

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
        .maybeSingle(); // Better: returning null instead of throwing on not found

    if (!data && !error) {
        return NextResponse.json(
            { error: `Product with ID ${id} not found` },
            { status: 404 },
        );
    }

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
