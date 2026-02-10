'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'

const splitACProducts = [
  {
    id: 3,
    name: 'Split AC - 1 Ton',
    category: 'Split AC',
    capacity: '1 Ton',
    price: 1499,
    image: '/modern-white-split-air-conditioner-indoor-unit.jpg',
    features: ['Inverter Technology', 'Sleep Mode', 'Auto Clean'],
  },
  {
    id: 4,
    name: 'Split AC - 1.5 Ton',
    category: 'Split AC',
    capacity: '1.5 Ton',
    price: 1899,
    image: '/premium-split-ac-with-display-panel.jpg',
    features: ['5-Star Rating', 'Smart Wi-Fi', 'Turbo Cooling'],
  },
  {
    id: 5,
    name: 'Split AC - 2 Ton',
    category: 'Split AC',
    capacity: '2 Ton',
    price: 2399,
    image: '/heavy-duty-split-air-conditioner-unit.jpg',
    features: ['Heavy Duty', 'Dual Inverter', 'Air Purifier'],
  },
]

export default function SplitACPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Split AC Systems</h1>
            <p className="text-lg text-muted-foreground">
              Modern, energy-efficient split AC units with inverter technology and smart controls for superior cooling performance.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {splitACProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
