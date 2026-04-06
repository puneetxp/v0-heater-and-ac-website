import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { checkAdminAccess } from "@/lib/check-admin";

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

        const uploadedUrls: string[] = [];
        const uploadDir = join(process.cwd(), "public", "uploads", "products");

        // Ensure upload directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            console.error("[upload] Failed to create upload directory:", err);
            return NextResponse.json(
                { error: "Failed to prepare upload directory" },
                { status: 500 },
            );
        }

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
            const filename = `${Date.now()}-${i}.${ext}`;
            const filepath = join(uploadDir, filename);

            try {
                await writeFile(filepath, Buffer.from(buffer));
                uploadedUrls.push(`/uploads/products/${filename}`);
                console.log(`[upload] Successfully uploaded file ${i}`);
            } catch (err) {
                console.error(`[upload] Failed to write file ${i}:`, err);
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
