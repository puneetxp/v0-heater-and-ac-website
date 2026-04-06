import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
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

        const uploadDir = join(process.cwd(), "public", "uploads", "products", productId);
        
        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        const urls: string[] = [];

        for (let i = 0; i < Math.min(files.length, 3); i++) {
            const file = files[i];
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const ext = file.name.split(".").pop() || "jpg";
            const fileName = `${Date.now()}-${i}.${ext}`;
            const path = join(uploadDir, fileName);

            await writeFile(path, buffer);
            
            // Public URL
            urls.push(`/uploads/products/${productId}/${fileName}`);
        }

        return NextResponse.json({ urls });
    } catch (err: any) {
        console.error("[upload-api] Local upload failed:", err);
        return NextResponse.json(
            { error: "Local upload failed: " + err.message },
            { status: 500 },
        );
    }
}
