import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminVariantManager } from "@/components/admin-variant-manager";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { checkAdminAccess } from "@/lib/check-admin";

export default async function AdminVariantsPage(
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Check admin status FIRST
  await checkAdminAccess();

  const { id } = await params;
  const supabase = await createClient();

  // 2. Get product with error handling
  const { data: product, error: productError } = await supabase.from("products")
    .select("*").eq("id", id).maybeSingle();

  if (productError || !product) {
    console.error("[v0] Product not found or error:", productError);
    redirect("/admin/products");
  }

  // Mock variants data (will integrate with DB later)
  const variants = [
    {
      id: "var-1",
      name: "1.0 Ton Inverter",
      capacity: "1.0 Ton",
      color: "#FFFFFF",
      specifications: {
        "energy_rating": "5 Star",
        "cooling_capacity": "1.0 Ton",
      },
      priceMultiplier: 1.0,
      isActive: true,
    },
    {
      id: "var-2",
      name: "1.5 Ton Inverter",
      capacity: "1.5 Ton",
      color: "#FFFFFF",
      specifications: {
        "energy_rating": "5 Star",
        "cooling_capacity": "1.5 Ton",
      },
      priceMultiplier: 1.15,
      isActive: true,
    },
  ];

  // Mock plans data (will integrate with DB later)
  const plans = [
    {
      id: "plan-1",
      name: "Monthly",
      durationMonths: 1,
      discountPercentage: 0,
      features: ["Free installation", "Basic maintenance", "24/7 support"],
      isPopular: false,
      isActive: true,
    },
    {
      id: "plan-2",
      name: "Quarterly",
      durationMonths: 3,
      discountPercentage: 10,
      features: [
        "Free installation",
        "Priority maintenance",
        "One free relocation",
        "Extended warranty",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      id: "plan-3",
      name: "Annual",
      durationMonths: 12,
      discountPercentage: 20,
      features: [
        "Free installation",
        "Premium maintenance",
        "Unlimited relocations",
        "Full warranty",
      ],
      isPopular: false,
      isActive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href="/admin/products" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-1">
          Edit: {product.name}
        </h1>
        <p className="text-muted-foreground text-sm">
          Update product details, images, variants, and rental plans.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Left: Product details + images */}
        <ProductEditForm product={product} />

        {/* Right: Variants & Plans */}
        <AdminVariantManager
          productId={id}
          variants={variants}
          plans={plans}
          onVariantAdd={(variant) => console.log("Add variant:", variant)}
          onVariantEdit={(variantId, variant) =>
            console.log("Edit variant:", variantId, variant)}
          onVariantDelete={(variantId) =>
            console.log("Delete variant:", variantId)}
          onPlanAdd={(plan) => console.log("Add plan:", plan)}
          onPlanEdit={(planId, plan) => console.log("Edit plan:", planId, plan)}
          onPlanDelete={(planId) => console.log("Delete plan:", planId)}
        />
      </div>
    </div>
  );
}
