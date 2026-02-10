import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string | number // Updated to support both string and number IDs
  name: string
  category: string
  capacity: string
  price: number
  image: string
  features: string[]
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Determine if it's a cooling or heating product
  const isCooling = product.category.toLowerCase().includes('ac') || product.category.toLowerCase().includes('window') || product.category.toLowerCase().includes('split')
  const isHeating = product.category.toLowerCase().includes('heater') || product.category.toLowerCase().includes('oil')
  
  // Generate clean SEO-friendly URL directly
  const generateCleanUrl = () => {
    // Map category to slug
    if (product.category.includes('Window')) {
      return `/cooling/window-ac/window-ac-${product.capacity.toLowerCase().replace(/\s+/g, '-')}`
    }
    if (product.category.includes('Split')) {
      return `/cooling/split-ac/split-ac-${product.capacity.toLowerCase().replace(/\s+/g, '-')}`
    }
    if (product.category.includes('Oil')) {
      return `/heating/oil-heater/oil-heater-${product.capacity.toLowerCase().replace(/\s+/g, '-')}`
    }
    return `/product/${product.id}`
  }
  
  const detailsUrl = generateCleanUrl()
  
  // Select badge color based on category
  const badgeColor = isCooling ? 'bg-blue-600 text-white' : isHeating ? 'bg-orange-600 text-white' : 'bg-primary'

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border hover:border-primary/40">
      <CardHeader className="p-0">
        <div className="relative h-56 overflow-hidden bg-muted/30">
          <img
            src={product.image || "/placeholder.svg?height=300&width=400"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <Badge className={`absolute top-4 right-4 text-white shadow-sm ${badgeColor}`}>
            {product.capacity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.category}</div>
          <h3 className="text-xl font-semibold">{product.name}</h3>
        </div>
        <div className="space-y-2.5">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-300">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1 transition-all duration-300" size="lg">
          <Link href={detailsUrl}>View Details</Link>
        </Button>
        <Button asChild className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" size="lg">
          <Link href={`/booking/${product.id}`}>Rent Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
