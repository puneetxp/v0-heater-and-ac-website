import { ProductCard } from "@/components/product-card"
import { CategorySection } from "@/components/category-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const acProducts = [
  {
    id: 1,
    name: "Window AC - 1 Ton",
    category: "Window AC",
    capacity: "1 Ton",
    price: 899,
    image: "/modern-white-window-air-conditioner-unit.jpg",
    features: ["Energy Efficient", "Quiet Operation", "Remote Control"],
  },
  {
    id: 2,
    name: "Window AC - 1.5 Ton",
    category: "Window AC",
    capacity: "1.5 Ton",
    price: 1199,
    image: "/large-window-ac-air-conditioner-cooling.jpg",
    features: ["Powerful Cooling", "Timer Function", "Easy Installation"],
  },
  {
    id: 3,
    name: "Split AC - 1 Ton",
    category: "Split AC",
    capacity: "1 Ton",
    price: 1499,
    image: "/modern-white-split-air-conditioner-indoor-unit.jpg",
    features: ["Inverter Technology", "Sleep Mode", "Auto Clean"],
  },
  {
    id: 4,
    name: "Split AC - 1.5 Ton",
    category: "Split AC",
    capacity: "1.5 Ton",
    price: 1899,
    image: "/premium-split-ac-with-display-panel.jpg",
    features: ["5-Star Rating", "Smart Wi-Fi", "Turbo Cooling"],
  },
  {
    id: 5,
    name: "Split AC - 2 Ton",
    category: "Split AC",
    capacity: "2 Ton",
    price: 2399,
    image: "/heavy-duty-split-air-conditioner-unit.jpg",
    features: ["Heavy Duty", "Dual Inverter", "Air Purifier"],
  },
]

const heaterProducts = [
  {
    id: 6,
    name: "Oil Heater - 5 Fin",
    category: "Oil Heater",
    capacity: "5 Fins",
    price: 599,
    image: "/5-fin-oil-filled-radiator-heater-portable.jpg",
    features: ["Portable", "Thermostat Control", "Safety Cut-off"],
  },
  {
    id: 7,
    name: "Oil Heater - 7 Fin",
    category: "Oil Heater",
    capacity: "7 Fins",
    price: 799,
    image: "/7-fin-oil-heater-radiator-with-wheels.jpg",
    features: ["Fast Heating", "3 Heat Settings", "Tip-Over Protection"],
  },
  {
    id: 8,
    name: "Oil Heater - 9 Fin",
    category: "Oil Heater",
    capacity: "9 Fins",
    price: 999,
    image: "/9-fin-oil-filled-heater-with-digital-display.jpg",
    features: ["Maximum Heat", "Digital Display", "Timer Function"],
  },
  {
    id: 9,
    name: "Oil Heater - 11 Fin",
    category: "Oil Heater",
    capacity: "11 Fins",
    price: 1299,
    image: "/11-fin-large-oil-radiator-heater-remote-control.jpg",
    features: ["Large Room Coverage", "Eco Mode", "Remote Control"],
  },
]

export function ProductGrid() {
  return (
    <section id="products" className="relative overflow-hidden">
      {/* Header Section */}
      <div className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 animate-slideInUp" style={{ animationFillMode: 'both' }}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight animate-fadeIn" style={{ animationFillMode: 'both', animationDelay: '0.2s' }}>
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance animate-fadeIn" style={{ animationFillMode: 'both', animationDelay: '0.3s' }}>
              Discover our premium collection of air conditioners and heaters, each designed for optimal comfort and efficiency.
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
  )
}
