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
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/products/${id}/delete`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");

            setProducts(products.filter((p) => p.id !== id));
            router.refresh();
        } catch (err) {
            alert("Failed to delete product. Please try again.");
            console.error(err);
        } finally {
            setDeletingId(null);
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
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={deletingId === product.id}
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                                {deletingId === product.id
                                    ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )
                                    : <Trash2 className="h-4 w-4" />}
                            </Button>
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
