import { createServerClient } from "@/lib/supabase/server";
import { ProductDetailView } from "@/components/product-detail-view";
import { allProducts } from "@/lib/product-data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage(props: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const params = await props.params;
  const supabase = await createServerClient();

  // 1. Try to find the product in the Database first
  let dbProduct = null;
  try {
    // Map URL category to DB category
    const dbCategoryMap: Record<string, string[]> = {
      cooling: ["window_ac", "split_ac"],
      heating: ["oil_heater"],
    };
    
    const targetCategories = dbCategoryMap[params.category] || [];
    
    if (targetCategories.length > 0) {
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .in("category", targetCategories);

      if (products) {
        // Find by generated slug
        dbProduct = products.find((p) => {
          // Fallback slug generation logic matching lib/product-data.ts if possible
          // But DB products might have different naming.
          const nameSlug = p.name.toLowerCase().replace(/\s+/g, "-");
          
          // Recreate the slug logic used in the app
          const categoryName = p.category.replace("_", " ");
          const appSlug = `${categoryName.toLowerCase().replace(/\s+/g, "-")}-${p.name.toLowerCase().split("-").pop()?.trim().toLowerCase().replace(/\s+/g, "-")}`;
          
          return nameSlug === params.slug || appSlug === params.slug;
        });
      }
    }
  } catch (err) {
    console.error("[v0] Database fetch failed for product page:", err);
  }

  // 2. If not in DB, fallback to static allProducts data
  if (!dbProduct) {
    const categoryMap: Record<string, any[]> = {
      cooling: [...allProducts.windowAC, ...allProducts.splitAC],
      heating: [...allProducts.oilHeater],
    };

    const categoryProducts = categoryMap[params.category] || [];

    for (const p of categoryProducts) {
      const productSlug = `${p.category.toLowerCase().replace(/\s+/g, "-")}-${p.capacity.toLowerCase().replace(/\s+/g, "-")}`;
      if (productSlug === params.slug) {
        // Convert static product to DB-like format for the component
        dbProduct = {
          id: String(p.id),
          name: p.name,
          category: p.category.toLowerCase().replace(/\s+/g, "_"),
          price_per_month: p.price,
          description: p.description,
          image_url: p.image,
          season: "all",
          is_available: true, // Static products are always available
        };
        break;
      }
    }
  }

  if (!dbProduct) {
    notFound();
  }

  return (
    <ProductDetailView 
      product={dbProduct} 
      categoryParam={params.category} 
      slugParam={params.slug} 
    />
  );
}
