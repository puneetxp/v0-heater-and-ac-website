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
  
  // Generate hierarchical SEO-friendly URL with category
  const generateCleanUrl = () => {
    // Determine parent category from product type
    const parentCategory = product.category.includes('Oil') ? 'heating' : 'cooling'
    const slug = `${product.category.toLowerCase().replace(/\s+/g, '-')}-${product.capacity.toLowerCase().replace(/\s+/g, '-')}`
    return `/${parentCategory}/products/${slug}`
  }
  
  const detailsUrl = generateCleanUrl()
  
  // Select badge color based on category
  const badgeColor = isCooling ? 'bg-blue-600 text-white' : isHeating ? 'bg-orange-600 text-white' : 'bg-primary'

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 rounded-xl">
      <CardHeader className="p-0">
        <div className="relative h-64 overflow-hidden bg-muted/30">
          <img
            src={product.image || "/placeholder.svg?height=300&width=400"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Badge className={`absolute top-4 right-4 text-white shadow-lg font-semibold ${badgeColor}`}>
            {product.capacity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-7 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest opacity-75">{product.category}</div>
          <h3 className="text-2xl font-bold leading-tight text-foreground">{product.name}</h3>
        </div>
        <div className="space-y-3 pt-1">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              <div className="h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/25 group-hover:shadow-sm transition-all duration-300">
                <Check className="h-3.5 w-3.5 text-primary font-bold" />
              </div>
              <span className="leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">Starting from</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                <span className="text-muted-foreground text-sm font-medium">/month</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-7 pb-7 pt-2 flex gap-3">
        <Button asChild variant="outline" className="flex-1 transition-all duration-300 h-11 font-semibold text-sm border-primary/20 hover:border-primary/40" size="lg">
          <Link href={detailsUrl}>View Details</Link>
        </Button>
        <Button asChild className="flex-1 bg-primary hover:bg-primary/95 transition-all duration-300 h-11 font-semibold text-sm hover:shadow-lg hover:shadow-primary/25" size="lg">
          <Link href={`/booking/${product.id}`}>Rent Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
