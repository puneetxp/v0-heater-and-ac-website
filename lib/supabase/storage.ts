import { createBrowserClient } from "@/lib/supabase/client";

const BUCKET = "product-images";

// Fallback images from public/ directory, mapped by category
export const FALLBACK_IMAGES: Record<string, string[]> = {
    "window_ac": [
        "/modern-white-window-air-conditioner-unit.jpg",
        "/large-window-ac-air-conditioner-cooling.jpg",
    ],
    "split_ac": [
        "/modern-white-split-air-conditioner-indoor-unit.jpg",
        "/heavy-duty-split-air-conditioner-unit.jpg",
        "/premium-split-ac-with-display-panel.jpg",
    ],
    "oil_heater": [
        "/7-fin-oil-heater-radiator-with-wheels.jpg",
        "/9-fin-oil-filled-heater-with-digital-display.jpg",
        "/11-fin-large-oil-radiator-heater-remote-control.jpg",
    ],
    default: [
        "/modern-air-conditioner-and-heater-in-luxury-home-i.jpg",
    ],
};

export function getFallbackImages(category?: string): string[] {
    if (!category) return FALLBACK_IMAGES.default;
    const key = category.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
    return FALLBACK_IMAGES[key] || FALLBACK_IMAGES.default;
}

export async function uploadProductImages(
    productId: string,
    files: File[],
): Promise<{ urls: string[]; error?: string }> {
    const supabase = createBrowserClient();
    
    // If Supabase is available, try to use it
    if (supabase) {
        const uploadedUrls: string[] = [];

        for (let i = 0; i < Math.min(files.length, 3); i++) {
            const file = files[i];
            const ext = file.name.split(".").pop() || "jpg";
            const path = `${productId}/${Date.now()}-${i}.${ext}`;

            const { error } = await supabase.storage.from(BUCKET).upload(
                path,
                file,
                {
                    upsert: false,
                    contentType: file.type,
                },
            );

            if (error) {
                console.error(
                    `[storage] Failed to upload image ${i}:`,
                    error.message,
                );
                continue;
            }

            const { data: { publicUrl } } = supabase.storage.from(BUCKET)
                .getPublicUrl(path);
            uploadedUrls.push(publicUrl);
        }

        if (uploadedUrls.length > 0) {
            return { urls: uploadedUrls };
        }
    }

    // Fallback to local storage API
    console.warn("[storage] Supabase failed or unavailable, using local storage fallback");
    
    try {
        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }

        const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            const errorMsg = data.error || `Upload failed with status ${res.status}`;
            return { urls: [], error: errorMsg };
        }

        const data = await res.json();
        return { urls: data.urls || [] };
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error during upload";
        console.error("[storage] Fallback upload failed:", errorMsg);
        return { urls: [], error: errorMsg };
    }
}

export async function deleteProductImage(path: string): Promise<void> {
    const supabase = createBrowserClient();
    if (!supabase) return;

    // Extract storage path from full URL if needed
    const storagePath = path.includes("/storage/v1/object/public/")
        ? path.split("/storage/v1/object/public/")[1].replace(`${BUCKET}/`, "")
        : path;

    await supabase.storage.from(BUCKET).remove([storagePath]);
}
