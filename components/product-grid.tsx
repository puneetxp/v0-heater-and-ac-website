import { ProductCard } from "@/components/product-card"
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
    <section id="products" className="py-16 md:py-24 lg:py-32 relative overflow-hidden px-4 md:px-6 lg:px-8">
      <div className="absolute top-0 left-1/4 w-96 h-96 gradient-primary rounded-full blur-3xl opacity-5" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 gradient-secondary rounded-full blur-3xl opacity-5" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center space-y-4 mb-12 md:mb-16 animate-slideInUp" style={{ animationFillMode: 'both' }}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight animate-fadeIn" style={{ animationFillMode: 'both', animationDelay: '0.2s' }}>
            Our{" "}
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance animate-fadeIn" style={{ animationFillMode: 'both', animationDelay: '0.3s' }}>
            Choose from our wide range of air conditioners and heaters. All units are well-maintained and ready for
            immediate rental.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 md:mb-16 h-12 bg-muted/50 p-1 border-2 border-border/40">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
            >
              All Products
            </TabsTrigger>
            <TabsTrigger
              value="ac"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
            >
              Air Conditioners
            </TabsTrigger>
            <TabsTrigger
              value="heaters"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-semibold"
            >
              Heaters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-12 md:space-y-16">
            <div>
              <h3 className="text-2xl font-bold mb-6 md:mb-8">Air Conditioners</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {acProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 md:mb-8">Heaters</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {heaterProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ac">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {acProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="heaters">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {heaterProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
