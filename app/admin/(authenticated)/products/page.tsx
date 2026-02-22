import { checkAdminAccess } from "@/lib/check-admin";
import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/admin/product-grid";

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
        <Button asChild className="gap-2">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductGrid initialProducts={products || []} />
    </div>
  );
}
