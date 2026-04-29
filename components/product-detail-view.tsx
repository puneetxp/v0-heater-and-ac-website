"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ProductAnimatedBackground } from "@/components/product-animated-bg";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, CheckCircle2, Clock, Flame, RotateCcw, Shield, ShoppingCart, Wind, Zap } from "lucide-react";
import Link from "next/link";
import { getFallbackImages } from "@/lib/supabase/storage";
import { useCart } from "@/lib/contexts/cart-context";

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

  const selectedPlan = dbPlans.find((p) => String(p.id) === String(selectedPlanId));
  const securityDeposit = 2000;
  const totalPrice = selectedPlan ? selectedPlan.base_price + securityDeposit : 0;

  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!selectedPlan) return;

    addToCart({
      productId: dbProduct.id,
      planId: selectedPlanId!,
      quantity: 1,
      productData: {
        name: dbProduct.name,
        image_url: product.image,
        category: dbProduct.category,
        price_per_month: dbProduct.price_per_month,
        deposit_amount: securityDeposit,
      },
      planData: {
        name: selectedPlan.name,
        base_price: selectedPlan.base_price,
        duration_months: selectedPlan.duration_months,
      }
    });


    // Enhanced Toast notification
    toast.success("Added to cart!", {
      description: `${dbProduct.name} - ${selectedPlan.name}`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

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

          <div className="grid lg:grid-cols-5 gap-16 mb-20 items-start">
            {/* Left Column: Sticky Image */}
            <div className="lg:col-span-2 lg:sticky lg:top-32 self-start h-fit z-10">
              <div
                className={`w-full rounded-2xl overflow-hidden bg-white/40 border border-white/20 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] aspect-square relative flex items-center justify-center p-4 md:p-6 group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full rounded-xl object-contain relative z-10 drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Right Column: Info & Selection */}
            <div className="lg:col-span-3 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={`px-4 py-1.5 rounded-full ${badgeColor} text-white uppercase tracking-widest text-xs font-black shadow-lg`}>
                    {product.category}
                  </Badge>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Card className="border-0 pb-0 shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-md">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <Zap className="w-6 h-6 text-primary" />
                      Select Rental Plan
                    </CardTitle>
                    <Badge variant="outline" className="bg-white/50 font-bold border-slate-200">
                      Prices incl. GST
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {dbPlans.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 font-bold italic">
                        No active rental plans available for this item.
                      </div>
                    ) : (
                      dbPlans.map((plan) => (
                        <button
                          key={plan.id}
                          disabled={!product.isAvailable}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`w-full p-8 text-left transition-all relative flex items-center justify-between group ${String(selectedPlanId) === String(plan.id)
                            ? "bg-primary/5"
                            : "hover:bg-slate-50"
                            } ${!product.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {String(selectedPlanId) === String(plan.id) && (
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary shadow-[4px_0_12px_rgba(var(--primary),0.3)]" />
                          )}
                          <div className="flex-1">
                            <div className={`text-xl font-black mb-1 transition-colors ${String(selectedPlanId) === String(plan.id) ? "text-primary" : "text-slate-900"}`}>
                              {plan.name}
                            </div>
                            <div className="flex items-center gap-4">
                              {plan.valid_until && (
                                <div className="text-xs font-bold text-orange-600 flex items-center gap-1.5 uppercase tracking-wider">
                                  <Flame className="w-3.5 h-3.5" />
                                  Valid till: {new Date(plan.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                              )}
                              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <RotateCcw className="w-3.5 h-3.5" />
                                {plan.duration_months} Month Duration
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-black transition-colors ${String(selectedPlanId) === String(plan.id) ? "text-primary" : "text-slate-900"}`}>
                              ₹{plan.base_price.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                              Per Duration
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Summary Box - Receipt Style */}
                  {selectedPlan && (
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden border-t border-white/5">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Order Summary</h4>
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-white text-[10px] font-bold">
                            {selectedPlan.name}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-medium">Rental Charges ({selectedPlan.duration_months} Months)</span>
                            <span className="font-bold">₹{selectedPlan.base_price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-medium">Security Deposit (Refundable)</span>
                            <span className="font-bold">₹{securityDeposit.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total Payable Now</div>
                            <div className="text-sm text-slate-500 font-bold">Inclusive of all taxes</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-slate-500">₹</span>
                              <span className="text-5xl font-black text-white">
                                {totalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || !selectedPlanId}
                  variant="outline"
                  size="lg"
                  className="h-20 rounded-3xl border-2 border-slate-200 hover:border-primary/50 text-slate-900 hover:text-primary hover:bg-primary/5 text-xl font-black shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Add to Cart
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={!product.isAvailable || !selectedPlanId}
                  size="lg"
                  className="h-20 rounded-3xl bg-primary hover:bg-primary/95 text-white text-xl font-black shadow-[0_20px_40px_-10px_rgba(var(--primary),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary),0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="mr-3 h-6 w-6 fill-white" />
                  Rent Now
                </Button>
              </div>
            </div>
          </div>


          {/* Details Section */}
          <Tabs defaultValue="features" className="w-full animate-fadeIn">
            <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl h-16 border border-white/20 mb-10 w-fit">
              <TabsTrigger value="features" className="px-8 rounded-xl font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-500">
                Features
              </TabsTrigger>
              <TabsTrigger value="specs" className="px-8 rounded-xl font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-500">
                Technical Specs
              </TabsTrigger>
              <TabsTrigger value="warranty" className="px-8 rounded-xl font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-500">
                Warranty
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features">
              <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white/60 backdrop-blur-xl overflow-hidden p-4">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                      { icon: Shield, text: "24/7 Priority Support", desc: "Round-the-clock emergency assistance" },
                      { icon: Clock, text: "Rapid Installation", desc: "Delivery & setup within 24 hours" },
                      { icon: RotateCcw, text: "Zero Maintenance", desc: "Free cleaning & regular servicing" },
                      { icon: Zap, text: "High Efficiency", desc: "Save up to 30% on electricity bills" },
                      { icon: CheckCircle2, text: "Full Warranty", desc: "No-questions-asked component replacement" },
                      { icon: ShoppingCart, text: "Flexi-Return", desc: "Cancel or pause your subscription anytime" },
                    ].map((feature, i) => (
                      <div key={i} className="group p-6 rounded-3xl hover:bg-white/80 transition-all duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                          <feature.icon className="w-6 h-6 text-primary group-hover:text-white" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">{feature.text}</h4>
                        <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs">
              <Card>
                <CardContent className="p-12">
                  <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-8">
                      <div className="group">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Category Selection</h4>
                        <p className="text-3xl font-black text-slate-900">
                          Premium {product.category}
                        </p>
                      </div>
                      <div className="group">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Efficiency Rating</h4>
                        <p className="text-3xl font-black text-slate-900">5 Star ISEER Rated</p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="group">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Build Quality</h4>
                        <p className="text-3xl font-black text-slate-900">Heavy-Duty Outdoor Unit</p>
                      </div>
                      <div className="group">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Logic Coverage</h4>
                        <p className="text-3xl font-black text-slate-900">Full System Protection</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warranty">
              <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white/60 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-12 text-center max-w-4xl mx-auto">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-6">Lifetime Protection Plan</h3>
                  <p className="text-2xl text-slate-600 font-medium leading-relaxed">
                    We stand behind every unit. Your {product.warranty} covers all mechanical failures, gas refills, and part replacements during your entire rental period.
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
