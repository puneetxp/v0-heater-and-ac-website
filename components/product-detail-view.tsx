"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ProductAnimatedBackground } from "@/components/product-animated-bg";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, Flame, Wind, Zap } from "lucide-react";
import Link from "next/link";
import { getFallbackImages } from "@/lib/supabase/storage";

interface Product {
  id: string;
  name: string;
  category: string;
  price_per_month: number;
  description: string | null;
  image_url: string | null;
  season: string;
  is_available: boolean;
}

interface ProductDetailViewProps {
  product: Product;
  plans: any[];
  categoryParam: string;
  slugParam: string;
}

export function ProductDetailView({
  product: dbProduct,
  plans: dbPlans,
  categoryParam,
  slugParam,
}: ProductDetailViewProps) {
  // Back link uses category parameter
  const backLink = `/${categoryParam}`;
  
  // Interactivity states
  const [selectedPlanId, setSelectedPlanId] = useState<string | number | null>(
    dbPlans.length > 0 ? dbPlans[0].id : null
  );

  // Determine badge color and icon based on product type
  const isCooling = dbProduct.category.toLowerCase().includes("ac");
  const isOilHeater = dbProduct.category.toLowerCase().includes("heater") || dbProduct.category.toLowerCase().includes("oil");
  
  const badgeColor = isCooling
    ? "bg-blue-600"
    : isOilHeater
    ? "bg-orange-600"
    : "bg-primary";
  const badgeIcon = isCooling ? Wind : isOilHeater ? Flame : Zap;

  const product = {
    name: dbProduct.name,
    category: dbProduct.category.replace("_", " "),
    basePrice: dbProduct.price_per_month,
    description: dbProduct.description ||
      "Premium rental product with professional service and support.",
    image: dbProduct.image_url || getFallbackImages(dbProduct.category)[0],
    warranty: "1 year manufacturer warranty",
    slug: slugParam,
    isAvailable: dbProduct.is_available,
  };

  const selectedPlan = dbPlans.find((p) => p.id === selectedPlanId);
  const totalPrice = selectedPlan ? selectedPlan.base_price : 0;

  const backColor = isCooling
    ? "text-blue-600 hover:text-blue-700"
    : isOilHeater
    ? "text-orange-600 hover:text-orange-700"
    : "text-gray-600 hover:text-gray-700";

  return (
    <main className="min-h-screen relative z-10 flex flex-col">
      <ProductAnimatedBackground type={isCooling ? "cooling" : "heating"} />
      <Header />

      <div className="flex-1 py-8 md:py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <Link
            href={backLink}
            className={`inline-flex items-center gap-2 ${backColor} mb-8 font-medium`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {product.category}s
          </Link>

          {!product.isAvailable && (
            <div className="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3">
              <Zap className="h-5 w-5 text-amber-600" />
              <p className="font-medium">
                This item is currently unavailable for new bookings in your area.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="flex items-center justify-center">
              <div
                className={`w-full rounded-2xl overflow-hidden bg-white/50 border-0 shadow-xl aspect-square relative flex items-center justify-center`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Badge className={`mb-3 ${badgeColor} text-white uppercase`}>
                  {product.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600">{product.description}</p>
              </div>

              <Card className="border-2 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Select Rental Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {dbPlans.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground italic">
                        No active rental plans available for this item.
                      </div>
                    ) : (
                      dbPlans.map((plan) => (
                        <button
                          key={plan.id}
                          disabled={!product.isAvailable}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`w-full p-5 text-left transition-all relative flex items-center justify-between ${
                            selectedPlanId === plan.id
                              ? "bg-blue-50/30"
                              : "hover:bg-gray-50"
                          } ${!product.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {selectedPlanId === plan.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                          )}
                          <div className="flex-1">
                            <div className="font-bold text-lg text-slate-900">{plan.name}</div>
                            {plan.valid_until && (
                              <div className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                Valid till: {new Date(plan.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-black text-2xl text-blue-600">
                              ₹{plan.base_price.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                               {plan.duration_months} Month{plan.duration_months !== 1 ? 's' : ''} Duration
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {selectedPlan && (
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-500 font-medium">Selected Plan:</span>
                      <span className="font-bold text-slate-900">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-blue-100">
                      <span className="text-slate-500 font-medium text-lg">Total Payable:</span>
                      <div className="text-right">
                        <span className="text-3xl font-black text-blue-600">₹{selectedPlan.base_price.toLocaleString()}</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                asChild
                disabled={!product.isAvailable}
                className={`w-full h-12 text-white text-lg shadow-lg ${
                    isCooling ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-600 hover:bg-orange-700"
                } ${!product.isAvailable ? "opacity-50 cursor-not-allowed grayscale pointer-events-none" : ""}`}
              >
                <Link
                  href={`/booking/${slugParam}?planId=${selectedPlanId}`}
                  onClick={(e) => (!product.isAvailable || !selectedPlanId) && e.preventDefault()}
                >
                  {product.isAvailable ? "Proceed to Booking" : "Currently Unavailable"}
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
            </TabsList>

            <TabsContent value="features">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      "24/7 Priority Support",
                      "Professional Installation Included",
                      "Free Maintenance & Servicing",
                      "Energy Efficient Performance",
                      "Rapid Response Repair Team",
                      "No Long-term Commitment",
                    ].map((feature, i) => (
                      <div key={i} className="flex gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Unit Type</h4>
                        <p className="text-gray-600">
                          {product.category}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">
                          Performance
                        </h4>
                        <p className="text-gray-600">High-efficiency cooling/heating</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Availability</h4>
                        <p className="text-gray-600">{product.isAvailable ? "Active" : "Closed"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Warranty</h4>
                        <p className="text-gray-600">Full logic coverage</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warranty">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    {product.warranty} during the entire rental period. We handle all repairs and replacements at no extra cost to you.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  );
}
