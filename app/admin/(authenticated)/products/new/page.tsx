"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProductImageUpload } from "@/components/admin/image-upload";
import { uploadProductImages } from "@/lib/supabase/storage";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [season, setSeason] = useState("all");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);

    const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleCreate() {
        if (!name || !category || !price) {
            setErrorMessage("Name, category, and price are required.");
            return;
        }

        setStatus("saving");
        setErrorMessage(null);

        try {
            // 1. Create the product first to get an ID if we don't have one?
            // Actually, we can generate a temporary ID or just use a placeholder for the storage path.
            // But it's better to create the product record first, then update it with images.
            // OR, we can upload images with a random UUID and then create the product.

            const tempId = Math.random().toString(36).substring(7);
            let finalImageUrl = null;

            if (newFiles.length > 0) {
                const uploaded = await uploadProductImages(tempId, newFiles);
                if (uploaded.length > 0) {
                    finalImageUrl = uploaded[0];
                }
            }

            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    category,
                    season,
                    price_per_month: Number(price),
                    description,
                    image_url: finalImageUrl,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${res.status}`);
            }

            const newProduct = await res.json();
            router.push(`/admin/products/${newProduct.id}/variants`);
            router.refresh();
        } catch (err: unknown) {
            setStatus("error");
            setErrorMessage(
                err instanceof Error ? err.message : "Unknown error",
            );
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon">
                    <Link href="/admin/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Add New Product</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. 1.5 Ton Window AC"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="price">Price / month (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="1299"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="window_ac">
                                        Window AC
                                    </SelectItem>
                                    <SelectItem value="split_ac">
                                        Split AC
                                    </SelectItem>
                                    <SelectItem value="oil_heater">
                                        Oil Heater
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="season">Season</Label>
                            <Select
                                defaultValue="all"
                                onValueChange={setSeason}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="summer">
                                        Summer
                                    </SelectItem>
                                    <SelectItem value="winter">
                                        Winter
                                    </SelectItem>
                                    <SelectItem value="all">
                                        All Year
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">
                            Description (Optional)
                        </Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Primary features..."
                        />
                    </div>

                    <ProductImageUpload
                        category={category}
                        onChange={(imgs, files) => {
                            setImageUrls(imgs);
                            setNewFiles(files);
                        }}
                    />

                    {status === "error" && errorMessage && (
                        <p className="text-sm text-red-500 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errorMessage}
                        </p>
                    )}

                    <Button
                        onClick={() => startTransition(handleCreate)}
                        disabled={status === "saving" || isPending}
                        className="w-full"
                    >
                        {status === "saving" || isPending
                            ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Product…
                                </>
                            )
                            : (
                                "Create Product"
                            )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
