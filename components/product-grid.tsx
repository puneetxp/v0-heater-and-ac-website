import { ProductCard } from "@/components/product-card";
import { CategorySection } from "@/components/category-section";
import { allProducts } from "@/lib/product-data";

export function ProductGrid() {
  const acProducts = [...allProducts.windowAC, ...allProducts.splitAC];
  const heaterProducts = [...allProducts.oilHeater];

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

      {/* Air Conditioners Section - Cooling Theme */}
      <CategorySection
        title="Air Conditioners"
        description="Premium cooling solutions for any space. Efficient, quiet, and ready to keep your environment perfectly cool."
        category="cooling"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {acProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CategorySection>

      {/* Heaters Section - Heating Theme */}
      <CategorySection
        title="Heaters"
        description="Reliable heating solutions for winter comfort. Fast, efficient, and perfect for any room size."
        category="heating"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {heaterProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CategorySection>
    </section>
  );
}
