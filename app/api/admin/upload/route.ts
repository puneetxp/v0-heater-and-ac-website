import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/check-admin";

export async function POST(req: NextRequest) {
    // 1. Authenticate admin
    try {
        await checkAdminAccess();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Process FormData
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];
        const productId = formData.get("productId") as string;

        if (!files || files.length === 0 || !productId) {
            return NextResponse.json(
                { error: "files and productId are required" },
                { status: 400 },
            );
        }

        const urls: string[] = [];
        let supabaseError: string | null = null;

        // 3. Try Supabase Storage first (via admin client to bypass RLS)
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const adminClient = createAdminClient();

        if (adminClient) {
            const BUCKET = "product-images";
            for (let i = 0; i < Math.min(files.length, 3); i++) {
                const file = files[i];
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const ext = file.name.split(".").pop() || "jpg";
                const path = `${productId}/${Date.now()}-${i}.${ext}`;

                const { data, error } = await adminClient.storage
                    .from(BUCKET)
                    .upload(path, buffer, {
                        contentType: file.type,
                        upsert: true,
                    });

                if (error) {
                    console.error("[upload-api] Supabase storage upload failed:", error);
                    supabaseError = error.message;
                    break;
                }

                const { data: { publicUrl } } = adminClient.storage
                    .from(BUCKET)
                    .getPublicUrl(path);
                urls.push(publicUrl);
            }

            if (urls.length > 0 && !supabaseError) {
                return NextResponse.json({ urls });
            }
        }

        // 4. Return error if Supabase failed or is not configured
        return NextResponse.json(
            { error: supabaseError || "Supabase Storage is not configured. Cloud storage is required to save images." },
            { status: 500 },
        );
    } catch (err: any) {
        console.error("[upload-api] Upload process failed:", err);
        return NextResponse.json(
            { error: "Upload process failed: " + err.message },
            { status: 500 },
        );
    }
}
