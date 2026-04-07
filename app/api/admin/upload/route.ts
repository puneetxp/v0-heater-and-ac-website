import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAccess } from "@/lib/check-admin";

const BUCKET = "product-images";

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
        const files = Array.from(formData.getAll("files")) as File[];

        console.log(`[upload] Received ${files.length} files`);

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 },
            );
        }

        // Initialize Supabase client with service role key (for server-side operations)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("[upload] Missing Supabase credentials");
            return NextResponse.json(
                { error: "Configuration Error: Supabase credentials are missing in your deployment. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel project settings." },
                { status: 500 },
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const uploadedUrls: string[] = [];
        const errors: string[] = [];

        // Process each file
        for (let i = 0; i < Math.min(files.length, 3); i++) {
            const file = files[i];

            console.log(`[upload] Processing file ${i}: name=${file.name}, type=${file.type}, size=${file.size}`);

            // Be more lenient with file type checking
            const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
            const isLikelyImage =
                file.type.startsWith("image/") ||
                ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);

            if (!isLikelyImage) {
                const msg = `File ${i} does not appear to be an image (type: ${file.type}, ext: ${ext}), skipping`;
                console.warn(`[upload] ${msg}`);
                errors.push(msg);
                continue;
            }

            const buffer = await file.arrayBuffer();
            const path = `products/${Date.now()}-${i}.${ext}`;

            try {
                const { error } = await supabase.storage.from(BUCKET).upload(
                    path,
                    new Blob([buffer], { type: file.type || "application/octet-stream" }),
                    {
                        upsert: false,
                        contentType: file.type || "application/octet-stream",
                    },
                );

                if (error) {
                    const msg = `Supabase upload failed for file ${i}: ${error.message}`;
                    console.error(`[upload] ${msg}`);
                    errors.push(msg);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(path);

                uploadedUrls.push(publicUrl);
                console.log(`[upload] Successfully uploaded file ${i}: ${publicUrl}`);
            } catch (err) {
                const msg = `Failed to upload file ${i}: ${err instanceof Error ? err.message : String(err)}`;
                console.error(`[upload] ${msg}`);
                errors.push(msg);
                continue;
            }
        }

        console.log(`[upload] Upload complete: ${uploadedUrls.length} successful, ${errors.length} errors`);

        if (!uploadedUrls.length) {
            const errorDetails = errors.join("; ");
            console.error(`[upload] All files failed: ${errorDetails}`);
            return NextResponse.json(
                { error: `Failed to upload any files: ${errorDetails}` },
                { status: 500 },
            );
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (err: any) {
        console.error("[upload] Unexpected error:", err);
        return NextResponse.json(
            { error: `Internal server error: ${err.message}` },
            { status: 500 },
        );
    }
}
