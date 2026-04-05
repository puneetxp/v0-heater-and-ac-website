import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Check, Leaf, Wind, Zap } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { generateProductSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SplitACPage() {
  const supabase = await createServerClient();
  
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", "split_ac")
    .eq("is_available", true);

  const displayProducts = dbProducts || [];

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <Badge className="mx-auto bg-blue-600 text-white px-4 py-1 text-sm">
              Split AC Systems
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Modern Cooling Excellence
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience premium inverter split AC systems with smart controls,
              energy efficiency, and whisper-quiet operation.
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
                <h3 className="font-semibold text-gray-900">
                  Energy Efficient
                </h3>
                <p className="text-sm text-gray-600">
                  5-star rated inverter technology saves up to 40% on power
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600">
                  <Wind className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ultra Quiet</h3>
                <p className="text-sm text-gray-600">
                  22 dB noise level for peaceful cooling experience
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Eco-Friendly</h3>
                <p className="text-sm text-gray-600">
                  R410A refrigerant with zero ozone depletion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="flex-1 py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">
            Choose Your Capacity
          </h2>

          {/* Products Grid */}
          {displayProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-2xl shadow-lg"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center relative overflow-hidden">
                    <img 
                        src={product.image_url || "/premium-split-ac-with-display-panel.jpg"} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-blue-600 text-white uppercase">
                      RECENT
                    </Badge>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description || "Premium inverter split air conditioner."}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                         <li className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          Inverter Technology
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          Smart Wi-Fi Control
                        </li>
                    </ul>

                    {/* Price & Button */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{product.price_per_month}
                        </span>
                        <span className="text-sm text-gray-600">/month</span>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-blue-600 hover:bg-blue-700 h-10"
                      >
                        <Link
                          href={`/cooling/products/${generateProductSlug(product.name)}`}
                        >
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
                <p className="text-gray-500">No split AC units are currently available for booking. Please check back soon!</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
