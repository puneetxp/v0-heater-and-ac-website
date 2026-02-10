'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Flame, Zap, Leaf, Check } from 'lucide-react'

const oilHeaterProducts = [
  {
    id: 6,
    name: 'Oil Heater - 7 Fin',
    category: 'Oil Heater',
    capacity: '7 Fins',
    price: 799,
    description: 'Compact portable heater perfect for small rooms',
    features: ['Fast Heating', '3 Heat Settings', 'Tip-Over Protection'],
  },
  {
    id: 7,
    name: 'Oil Heater - 9 Fin',
    category: 'Oil Heater',
    capacity: '9 Fins',
    price: 999,
    description: 'Ideal heating solution for medium-sized rooms',
    features: ['Maximum Heat', 'Digital Display', 'Timer Function'],
  },
  {
    id: 8,
    name: 'Oil Heater - 11 Fin',
    category: 'Oil Heater',
    capacity: '11 Fins',
    price: 1299,
    description: 'Premium heater for large rooms and offices',
    features: ['Large Room Coverage', 'Eco Mode', 'Remote Control'],
  },
]

export default function OilHeaterPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 via-orange-50 to-yellow-50 py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <Badge className="mx-auto bg-orange-600 text-white px-4 py-1 text-sm">Oil Heaters</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Reliable Winter Warmth
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Portable oil-filled radiator heaters providing consistent warmth and comfort during cold winters. Available in multiple sizes to match your heating needs.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-600">
                  <Flame className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Heating</h3>
                <p className="text-sm text-gray-600">Reaches optimal temperature in minutes for instant warmth</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-600">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Energy Efficient</h3>
                <p className="text-sm text-gray-600">Smart thermostat control keeps power consumption minimal</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-600">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Portable & Safe</h3>
                <p className="text-sm text-gray-600">Lightweight with tip-over protection and safety cutoff</p>
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
            {oilHeaterProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-2xl shadow-lg">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flame className="h-24 w-24 text-orange-300 opacity-20" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-orange-600 text-white">{product.capacity}</Badge>
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
                      <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                    <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 h-10">
                      <Link href="/heating/oil-heater/product">
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
