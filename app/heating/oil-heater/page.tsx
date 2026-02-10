'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'

const oilHeaterProducts = [
  {
    id: 6,
    name: 'Oil Heater - 5 Fin',
    category: 'Oil Heater',
    capacity: '5 Fins',
    price: 599,
    image: '/5-fin-oil-filled-radiator-heater-portable.jpg',
    features: ['Portable', 'Thermostat Control', 'Safety Cut-off'],
  },
  {
    id: 7,
    name: 'Oil Heater - 7 Fin',
    category: 'Oil Heater',
    capacity: '7 Fins',
    price: 799,
    image: '/7-fin-oil-heater-radiator-with-wheels.jpg',
    features: ['Fast Heating', '3 Heat Settings', 'Tip-Over Protection'],
  },
  {
    id: 8,
    name: 'Oil Heater - 9 Fin',
    category: 'Oil Heater',
    capacity: '9 Fins',
    price: 999,
    image: '/9-fin-oil-filled-heater-with-digital-display.jpg',
    features: ['Maximum Heat', 'Digital Display', 'Timer Function'],
  },
  {
    id: 9,
    name: 'Oil Heater - 11 Fin',
    category: 'Oil Heater',
    capacity: '11 Fins',
    price: 1299,
    image: '/11-fin-large-oil-radiator-heater-remote-control.jpg',
    features: ['Large Room Coverage', 'Eco Mode', 'Remote Control'],
  },
]

export default function OilHeaterPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Oil Heaters</h1>
            <p className="text-lg text-muted-foreground">
              Reliable, portable oil-filled radiator heaters providing consistent warmth and comfort during cold winters. Choose from various sizes to match your heating needs.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {oilHeaterProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
