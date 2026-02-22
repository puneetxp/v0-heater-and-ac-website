"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProductImageUpload } from "@/components/admin/image-upload";
import { getFallbackImages, uploadProductImages } from "@/lib/supabase/storage";
import { AlertCircle, Check, Loader2 } from "lucide-react";

interface Product {
    id: string;
    name: string;
    category: string;
    price_per_month: number;
    season?: string;
    is_available?: boolean;
    image_url?: string | null;
    description?: string | null;
}

interface ProductEditFormProps {
    product: Product;
    onSaved?: (updated: Product) => void;
}

export function ProductEditForm({ product, onSaved }: ProductEditFormProps) {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(String(product.price_per_month));
    const [description, setDescription] = useState(product.description || "");
    const [isAvailable, setIsAvailable] = useState(
        product.is_available ?? true,
    );

    // Images: start from current image_url, then fallbacks if none
    const existingImages = product.image_url
        ? [product.image_url]
        : getFallbackImages(product.category);
    const [imageUrls, setImageUrls] = useState<string[]>(existingImages);
    const [newFiles, setNewFiles] = useState<File[]>([]);

    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
        "idle",
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSave() {
        setStatus("saving");
        setErrorMessage(null);

        try {
            let finalImageUrl = imageUrls[0] ?? null;

            // Upload new files if any were picked
            if (newFiles.length > 0) {
                const uploaded = await uploadProductImages(
                    product.id,
                    newFiles,
                );
                if (uploaded.length > 0) {
                    // Merge: uploaded images replace the local blob previews from the end
                    const existing = imageUrls.filter((u) =>
                        !u.startsWith("blob:")
                    );
                    const combined = [...existing, ...uploaded].slice(0, 3);
                    setImageUrls(combined);
                    finalImageUrl = combined[0];
                }
            }

            // Persist to DB via API route
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price_per_month: Number(price),
                    description,
                    is_available: isAvailable,
                    image_url: finalImageUrl,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${res.status}`);
            }

            const updated: Product = await res.json();
            setStatus("saved");
            setNewFiles([]);
            onSaved?.(updated);
            // Reset saved indicator after 2 seconds
            setTimeout(() => setStatus("idle"), 2000);
        } catch (err: unknown) {
            setStatus("error");
            setErrorMessage(
                err instanceof Error ? err.message : "Unknown error",
            );
        }
    }

    const isDirty = name !== product.name ||
        price !== String(product.price_per_month) ||
        description !== (product.description || "") ||
        isAvailable !== (product.is_available ?? true) ||
        newFiles.length > 0;

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Product Details</CardTitle>
                    <Badge
                        variant={isAvailable ? "default" : "secondary"}
                        onClick={() => setIsAvailable(!isAvailable)}
                        className="cursor-pointer select-none"
                    >
                        {isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Name + Price row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-name">Name</Label>
                        <Input
                            id="prod-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Product name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-price">Price / month (₹)</Label>
                        <Input
                            id="prod-price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 1299"
                            min={0}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <Label htmlFor="prod-desc">Description</Label>
                    <Input
                        id="prod-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short product description"
                    />
                </div>

                {/* Image Upload */}
                <ProductImageUpload
                    currentImages={imageUrls}
                    category={product.category}
                    onChange={(imgs, files) => {
                        setImageUrls(imgs);
                        setNewFiles(files);
                    }}
                />

                {/* Error */}
                {status === "error" && errorMessage && (
                    <p className="text-sm text-red-500 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errorMessage}
                    </p>
                )}

                {/* Save button */}
                <Button
                    onClick={() => startTransition(handleSave)}
                    disabled={!isDirty || status === "saving" || isPending}
                    className="w-full"
                    size="sm"
                >
                    {status === "saving" || isPending
                        ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving…
                            </>
                        )
                        : status === "saved"
                        ? (
                            <>
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                Saved!
                            </>
                        )
                        : (
                            "Save Changes"
                        )}
                </Button>
            </CardContent>
        </Card>
    );
}
