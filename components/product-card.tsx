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
  return (
    <Card className="group overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border hover:border-primary/30 animate-scaleIn" style={{ animationFillMode: 'both' }}>
      <CardHeader className="p-0">
        <div className="relative h-56 overflow-hidden bg-muted/30">
          <img
            src={product.image || "/placeholder.svg?height=300&width=400"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-sm animate-bounceCustom" style={{ animationIterationCount: '2' }}>
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
            <div key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
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
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30" size="lg">
          <Link href={`/booking/${product.id}`}>Rent Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
