import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAccess } from "@/lib/check-admin";

const BUCKET = "product-images";

export async function POST(req: NextRequest) {
    // Check admin access
    try {
        await checkAdminAccess();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files.length) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 },
            );
        }

        // Initialize Supabase client with service role key (for server-side operations)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        );

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error("[upload] Missing Supabase credentials");
            return NextResponse.json(
                { error: "Storage service not available" },
                { status: 500 },
            );
        }

        const uploadedUrls: string[] = [];

        // Process each file
        for (let i = 0; i < Math.min(files.length, 3); i++) {
            const file = files[i];

            // Validate file
            if (!file.type.startsWith("image/")) {
                console.warn(`[upload] File ${i} is not an image, skipping`);
                continue;
            }

            const buffer = await file.arrayBuffer();
            const ext = file.name.split(".").pop() || "jpg";
            const path = `products/${Date.now()}-${i}.${ext}`;

            try {
                const { error } = await supabase.storage.from(BUCKET).upload(
                    path,
                    new Blob([buffer], { type: file.type }),
                    {
                        upsert: false,
                        contentType: file.type,
                    },
                );

                if (error) {
                    console.error(`[upload] Supabase upload failed for file ${i}:`, error);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(path);

                uploadedUrls.push(publicUrl);
                console.log(`[upload] Successfully uploaded file ${i}`);
            } catch (err) {
                console.error(`[upload] Failed to upload file ${i}:`, err);
                continue;
            }
        }

        if (!uploadedUrls.length) {
            return NextResponse.json(
                { error: "Failed to upload any files" },
                { status: 500 },
            );
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (err) {
        console.error("[upload] Unexpected error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
