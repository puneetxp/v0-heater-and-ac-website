"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CategorySection } from "@/components/category-section";
import { allProducts } from "@/lib/product-data";
import { useSupabaseClient } from "@/lib/hooks/use-supabase";

export function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all active products
        const { data: dbProducts } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        if (dbProducts) {
          // For each product, fetch its lowest seasonal plan price
          const productsWithPrices = await Promise.all(
            dbProducts.map(async (p) => {
              const { data: plans } = await supabase
                .from("seasonal_plans")
                .select("base_price")
                .eq("product_id", p.id)
                .eq("is_active", true)
                .order("base_price", { ascending: true })
                .limit(1);

              return {
                ...p,
                // Use DB price_per_month as a fallback, or the lowest plan price
                price: plans?.[0]?.base_price || p.price_per_month || 0,
                // Fallback to static image if DB doesn't have one
                image: p.image_url || null,
                features: p.features || [],
              };
            })
          );
          setProducts(productsWithPrices);
        }
      } catch (error) {
        console.error("[v0] Failed to fetch products for grid:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [supabase]);

  // Grouping logic
  const acProducts = products.filter(p => p.category === "window_ac" || p.category === "split_ac");
  const heaterProducts = products.filter(p => p.category === "oil_heater");

  // Fallback to static data ONLY if loading is finished and DB is empty
  const finalAC = (!loading && products.length === 0) 
    ? [...allProducts.windowAC, ...allProducts.splitAC] 
    : acProducts;
  
  const finalHeater = (!loading && products.length === 0)
    ? [...allProducts.oilHeater]
    : heaterProducts;

  return (
    <section id="products" className="relative overflow-hidden">
      {/* Header Section with improved spacing */}
      <div className="py-16 md:py-24 lg:py-28 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background via-background/50 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div
            className="text-center space-y-6 animate-slideInUp"
            style={{ animationFillMode: "both" }}
          >
            <div className="space-y-2">
              <p
                className="text-sm font-semibold text-primary uppercase tracking-widest animate-fadeIn"
                style={{ animationFillMode: "both", animationDelay: "0.1s" }}
              >
                Premium Selection
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-pretty animate-fadeIn"
                style={{ animationFillMode: "both", animationDelay: "0.2s" }}
              >
                Our{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Products
                </span>
              </h2>
            </div>
            <p
              className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed animate-fadeIn"
              style={{ animationFillMode: "both", animationDelay: "0.3s" }}
            >
              Discover our premium collection of air conditioners and heaters,
              each designed for optimal comfort, efficiency, and reliability.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading products...</div>
      ) : (
        <>
          {/* Air Conditioners Section - Cooling Theme */}
          {finalAC.length > 0 && (
            <CategorySection
              title="Air Conditioners"
              description="Premium cooling solutions for any space. Efficient, quiet, and ready to keep your environment perfectly cool."
              category="cooling"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {finalAC.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </CategorySection>
          )}

          {/* Heaters Section - Heating Theme */}
          {finalHeater.length > 0 && (
            <CategorySection
              title="Heaters"
              description="Reliable heating solutions for winter comfort. Fast, efficient, and perfect for any room size."
              category="heating"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {finalHeater.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </CategorySection>
          )}
        </>
      )}
    </section>
  );
}
