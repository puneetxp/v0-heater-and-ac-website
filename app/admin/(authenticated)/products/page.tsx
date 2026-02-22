import { checkAdminAccess } from "@/lib/check-admin";
import { createServerClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminProductsPage() {
  await checkAdminAccess();
  const supabase = await createServerClient();

  const { data: products } = await supabase.from("products").select("*").order(
    "category",
    { ascending: true },
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Products Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your AC units and heaters inventory
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-slate-100">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
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
                  {product.category.replace("_", " ")}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{product.price_per_month}
                  </p>
                  <p className="text-xs text-slate-500">per month</p>
                </div>
                <Badge variant={product.is_available ? "default" : "secondary"}>
                  {product.is_available ? "Available" : "Unavailable"}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  <Link href={`/admin/products/${product.id}/variants`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
