"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/contexts/cart-context";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { generateProductSlug } from "@/lib/utils";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, itemCount, subtotal, totalDeposit } = useCart();

  const gst = subtotal * 0.18;
  const total = subtotal + gst + totalDeposit;

  if (itemCount === 0) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50/50">
        <Header />
        <div className="flex-1 container mx-auto max-w-4xl px-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-full shadow-sm mb-6">
            <ShoppingBag className="h-16 w-16 text-slate-300" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-slate-500 mb-8 max-w-md">
            Looks like you haven't added any rental services yet. Browse our premium ACs and heaters to get started.
          </p>
          <Button asChild size="lg" className="px-8 bg-primary hover:bg-primary/90">
            <Link href="/#products">Browse Products</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <div className="flex-1 container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isHeating = item.productData.category.toLowerCase().includes("heater") ||
                item.productData.category.toLowerCase().includes("oil");
              const parentCategory = isHeating ? "heating" : "cooling";
              const slug = generateProductSlug(item.productData.name);
              const detailsUrl = `/${parentCategory}/products/${slug}`;

              return (
                <Card key={`${item.productId}-${item.planId}`} className="overflow-hidden border-none shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4 md:gap-6">
                      <Link 
                        href={detailsUrl}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 hover:opacity-90 transition-opacity block"
                      >
                        <img 
                          src={item.productData.image_url} 
                          alt={item.productData.name} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <Link href={detailsUrl} className="hover:text-primary transition-colors block">
                                <h3 className="text-lg md:text-xl font-bold text-slate-900">{item.productData.name}</h3>
                              </Link>
                              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{item.planData?.name || "Monthly Plan"}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 -mt-2 -mr-2"
                              onClick={() => removeFromCart(item.productId, item.planId)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow-sm">
                            <button 
                              className="p-2 hover:bg-slate-50 transition-colors border-r"
                              onClick={() => updateQuantity(item.productId, item.planId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 font-bold text-slate-700 min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              className="p-2 hover:bg-slate-50 transition-colors border-l"
                              onClick={() => updateQuantity(item.productId, item.planId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xl font-black text-primary">
                              ₹{((item.planData?.base_price || item.productData.price_per_month) * item.quantity).toLocaleString()}
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Rental Fee</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-none shadow-md bg-white">
              <CardContent className="p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold border-b pb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18%)</span>
                    <span className="font-bold">₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Refundable Deposit</span>
                    <span className="font-bold">₹{totalDeposit.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-lg font-bold">Total Amount</span>
                    <div className="text-right">
                      <div className="text-3xl font-black text-primary">₹{total.toLocaleString()}</div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Payable Now</p>
                    </div>
                  </div>
                </div>
                
                <Button asChild size="lg" className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/95 shadow-lg shadow-primary/20">
                  <Link href="/checkout" className="flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                
                <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed uppercase tracking-tighter">
                  By proceeding, you agree to our Terms of Service and Privacy Policy. All rentals include free installation and maintenance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
