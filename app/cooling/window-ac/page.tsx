'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Wind, Zap, Leaf, Check } from 'lucide-react'

const windowACProducts = [
  {
    id: 1,
    name: 'Window AC - 1 Ton',
    category: 'Window AC',
    capacity: '1 Ton',
    price: 899,
    description: 'Perfect for small rooms and apartments',
    features: ['Energy Efficient', 'Quiet Operation', 'Remote Control'],
  },
  {
    id: 2,
    name: 'Window AC - 1.5 Ton',
    category: 'Window AC',
    capacity: '1.5 Ton',
    price: 1199,
    description: 'Best for medium-sized rooms',
    features: ['Powerful Cooling', 'Timer Function', 'Easy Installation'],
  },
]

export default function WindowACPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <Badge className="mx-auto bg-blue-600 text-white px-4 py-1 text-sm">Window AC Units</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Affordable Compact Cooling
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Easy-to-install window AC units perfect for renters and small apartments with excellent cooling efficiency.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Energy Efficient</h3>
                <p className="text-sm text-gray-600">3-star rated units deliver powerful cooling at low cost</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600">
                  <Wind className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Install</h3>
                <p className="text-sm text-gray-600">Fits standard windows with professional installation included</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Budget Friendly</h3>
                <p className="text-sm text-gray-600">Most affordable rental option starting at ₹899/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="flex-1 py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Choose Your Capacity</h2>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {windowACProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-2xl shadow-lg">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wind className="h-24 w-24 text-blue-300 opacity-20" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-blue-600 text-white">{product.capacity}</Badge>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price & Button */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-10">
                      <Link href={`/cooling/window-ac/window-ac-${product.capacity.replace(/\s+/g, '-').toLowerCase()}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
