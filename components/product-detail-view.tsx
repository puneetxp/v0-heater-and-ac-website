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
  categoryParam: string;
  slugParam: string;
}

export function ProductDetailView({
  product: dbProduct,
  categoryParam,
  slugParam,
}: ProductDetailViewProps) {
  // Back link uses category parameter
  const backLink = `/${categoryParam}`;
  
  // Interactivity states
  const [selectedVariant, setSelectedVariant] = useState("standard");
  const [selectedPlan, setSelectedPlan] = useState("monthly");

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

  // Mock variants for now - in a real app these would come from the DB
  const variants = [
    {
      id: "lite",
      name: "Economy",
      multiplier: 0.9,
      description: "Essential performance",
    },
    {
      id: "standard",
      name: "Standard",
      multiplier: 1.0,
      description: "Balanced efficiency",
    },
    {
      id: "pro",
      name: "Premium",
      multiplier: 1.2,
      description: "Maximum performance",
    },
  ];

  const plans = [
    { id: "monthly", name: "Monthly", months: 1, discount: 0 },
    { id: "quarterly", name: "Quarterly", months: 3, discount: 10 },
    { id: "annual", name: "Annual", months: 12, discount: 20 },
  ];

  const selectedVariantData = variants.find((v) => v.id === selectedVariant);
  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  const variantPrice = Math.round(
    product.basePrice * (selectedVariantData?.multiplier || 1),
  );
  const discountedPrice = Math.round(
    variantPrice * (1 - (selectedPlanData?.discount || 0) / 100),
  );
  const totalPrice = discountedPrice * (selectedPlanData?.months || 1);

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

              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Select Option</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        disabled={!product.isAvailable}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedVariant === variant.id
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-gray-100 hover:border-blue-200"
                        } ${!product.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex justify-between items-center">
                            <div className="font-bold text-lg">{variant.name}</div>
                            <div className="font-bold text-blue-600 text-lg">
                                ₹{Math.round(product.basePrice * variant.multiplier)}/mo
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {variant.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Select Rental Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      disabled={!product.isAvailable}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === plan.id
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-gray-100 hover:border-blue-200"
                      } ${!product.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold">{plan.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            ₹{Math.round(discountedPrice)}/month
                          </div>
                        </div>
                        {plan.discount > 0 && (
                          <Badge className="bg-green-600 text-white">
                            Save {plan.discount}%
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Total Cost Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Monthly Rate:</span>
                    <span className="font-semibold">₹{variantPrice}</span>
                  </div>
                  {selectedPlanData?.discount
                    ? (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({selectedPlanData.discount}%):</span>
                        <span>
                          -₹{Math.round(
                            variantPrice * selectedPlanData.discount / 100,
                          )}
                        </span>
                      </div>
                    )
                    : null}
                  <div className="border-t pt-4 flex justify-between text-xl font-bold text-blue-700">
                    <span>
                      Total for {selectedPlanData?.months}{" "}
                      month{selectedPlanData?.months !== 1 ? "s" : ""}:
                    </span>
                    <span>₹{totalPrice}</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                asChild
                disabled={!product.isAvailable}
                className={`w-full h-12 text-white text-lg shadow-lg ${
                    isCooling ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-600 hover:bg-orange-700"
                } ${!product.isAvailable ? "opacity-50 cursor-not-allowed grayscale pointer-events-none" : ""}`}
              >
                <Link
                  href={`/booking/${slugParam}?variant=${selectedVariant}&plan=${selectedPlan}`}
                  onClick={(e) => !product.isAvailable && e.preventDefault()}
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
