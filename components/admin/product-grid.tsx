"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Edit, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFallbackImages } from "@/lib/supabase/storage";
import { DeleteButton } from "@/components/admin/delete-button";

interface Product {
    id: string;
    name: string;
    category: string;
    price_per_month: number;
    season: string;
    is_available: boolean;
    image_url: string | null;
}

interface ProductGridProps {
    initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);

    async function handleToggleAvailability(id: string, currentStatus: boolean) {
        const newStatus = !currentStatus;
        try {
            // Optimistic update
            setProducts(
                products.map((p) =>
                    p.id === id ? { ...p, is_available: newStatus } : p
                ),
            );

            // Find current product to get all required fields for the PATCH API
            const product = products.find((p) => p.id === id);
            if (!product) return;

            const res = await fetch(`/api/admin/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: product.name,
                    price_per_month: product.price_per_month,
                    is_available: newStatus,
                }),
            });

            if (!res.ok) throw new Error("Failed to update status");
            router.refresh();
        } catch (err) {
            alert("Failed to update availability. Please try again.");
            console.error(err);
            // Rollback on error
            setProducts(
                products.map((p) =>
                    p.id === id ? { ...p, is_available: currentStatus } : p
                ),
            );
        }
    }


    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                            src={product.image_url &&
                                    product.image_url.trim() !== ""
                                ? product.image_url
                                : getFallbackImages(product.category)[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                    "/modern-air-conditioner-and-heater-in-luxury-home-i.jpg";
                            }}
                        />
                        <Badge className="absolute top-3 right-3 capitalize">
                            {product.season}
                        </Badge>
                    </div>
                    <CardContent className="p-6 space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">
                                {product.name}
                            </h3>
                            <p className="text-sm text-slate-500 capitalize">
                                {typeof product.category === "string"
                                    ? product.category.replace("_", " ")
                                    : "Category"}
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    ₹{product.price_per_month}
                                </p>
                                <p className="text-xs text-slate-500">
                                    per month
                                </p>
                            </div>
                            <Badge
                                variant={product.is_available
                                    ? "default"
                                    : "secondary"}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() =>
                                    handleToggleAvailability(
                                        product.id,
                                        product.is_available,
                                    )}
                            >
                                {product.is_available
                                    ? "Available"
                                    : "Unavailable"}
                            </Badge>
                        </div>

                        <div className="flex gap-2">
                            <Link
                                href={`/admin/products/${product.id}`}
                                className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3"
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Link>
                            <DeleteButton
                                id={product.id}
                                endpoint="/api/admin/products/[id]/delete"
                                resourceName="Product"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent border-slate-200"
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}

            {products.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed">
                    No products found. Add your first product to get started.
                </div>
            )}
        </div>
    );
}
