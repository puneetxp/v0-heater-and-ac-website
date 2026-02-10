'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'

const windowACProducts = [
  {
    id: 1,
    name: 'Window AC - 1 Ton',
    category: 'Window AC',
    capacity: '1 Ton',
    price: 899,
    image: '/modern-white-window-air-conditioner-unit.jpg',
    features: ['Energy Efficient', 'Quiet Operation', 'Remote Control'],
  },
  {
    id: 2,
    name: 'Window AC - 1.5 Ton',
    category: 'Window AC',
    capacity: '1.5 Ton',
    price: 1199,
    image: '/large-window-ac-air-conditioner-cooling.jpg',
    features: ['Powerful Cooling', 'Timer Function', 'Easy Installation'],
  },
]

export default function WindowACPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Window AC Units</h1>
            <p className="text-lg text-muted-foreground">
              Compact, affordable, and easy to install window air conditioners perfect for small rooms and apartments.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {windowACProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
