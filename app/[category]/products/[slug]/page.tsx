import { createServerClient } from "@/lib/supabase/server";
import { ProductDetailView } from "@/components/product-detail-view";
import { allProducts } from "@/lib/product-data";
import { notFound } from "next/navigation";
import { generateProductSlug } from "@/lib/utils";

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
        console.log(`[v0] Fetched ${products.length} products for categories:`, targetCategories);
        // Find by generated slug OR by ID if slug is numeric
        dbProduct = products.find((p) => {
          const nameSlug = generateProductSlug(p.name);
          console.log(`[v0] Comparing DB: '${nameSlug}' === '${params.slug}' (ID: ${p.id})`);
          return nameSlug === params.slug || String(p.id) === params.slug;
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
      const productSlug = generateProductSlug(p.name);
      if (productSlug === params.slug || String(p.id) === params.slug) {
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

  // 3. Fetch seasonal plans for this product
  let plans = [];
  if (dbProduct && dbProduct.id) {
    const { data: dbPlans } = await supabase
      .from("seasonal_plans")
      .select("*")
      .eq("product_id", dbProduct.id)
      .eq("is_active", true)
      .order("base_price", { ascending: true });
    
    if (dbPlans) {
      plans = dbPlans;
    }
  }

  return (
    <ProductDetailView 
      product={dbProduct} 
      plans={plans}
      categoryParam={params.category} 
      slugParam={params.slug} 
    />
  );
}
