"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/contexts/cart-context";
import { useSupabaseClient } from "@/lib/hooks/use-supabase";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Link, MapPin, Truck, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const { items, clearCart, itemCount, subtotal, totalDeposit } = useCart();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    async function getUser() {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          // Fetch profile for address
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
          if (profile) {
            setFormData({
              name: profile.full_name || user.user_metadata?.full_name || "",
              email: user.email || "",
              phone: profile.phone || "",
              address: profile.address || "",
              city: profile.city || "",
              state: profile.state || "",
              pincode: profile.pincode || "",
            });
          }
        }
      }
    }
    getUser();
  }, [supabase]);

  const gst = subtotal * 0.18;
  const total = subtotal + gst + totalDeposit;

  const handleGoogleLogin = async () => {
    if (supabase) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/checkout",
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!supabase) throw new Error("Supabase not initialized");

      // 1. Create a main booking record
      const { data: booking, error: bookingError } = await supabase.from("bookings").insert({
        user_id: user?.id || null,
        total_amount: total,
        subtotal: subtotal,
        gst_amount: gst,
        deposit_amount: totalDeposit,
        delivery_address: formData.address,
        delivery_city: formData.city,
        delivery_state: formData.state,
        delivery_pincode: formData.pincode,
        notes: `Guest Email: ${formData.email}, Phone: ${formData.phone}`,
        status: "pending",
      }).select("id").single();

      if (bookingError) throw bookingError;

      // 2. Add items (Try to add to booking_items, if it fails, it might not exist yet)
      const itemData = items.map(item => ({
        booking_id: booking.id,
        product_id: item.productId,
        seasonal_plan_id: item.planId,
        quantity: item.quantity,
        unit_price: item.planData?.base_price || item.productData.price_per_month,
        subtotal: (item.planData?.base_price || item.productData.price_per_month) * item.quantity,
      }));

      const { error: itemsError } = await supabase.from("booking_items").insert(itemData);

      if (itemsError) {
        console.warn("Failed to insert into booking_items, falling back to JSON in notes", itemsError);
        // Fallback: update the notes with the items info if table doesn't exist
        await supabase.from("bookings").update({
          notes: `Items: ${JSON.stringify(itemData)}. Guest Info: ${formData.email}, ${formData.phone}`
        }).eq("id", booking.id);
      }

      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 3000);

    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Failed to process checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-500 mb-8">
            Your rental booking has been placed successfully. Redirecting you to your dashboard...
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-progress" style={{ width: "100%" }}></div>
          </div>
        </div>
      </main>
    );
  }

  if (itemCount === 0 && !isSuccess) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50/50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild><Link href="/">Return to Shop</Link></Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <div className="flex-1 container mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!user && (
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-blue-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Express Checkout
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                      <p className="text-slate-600 mb-4 font-medium">Save your address and track orders by signing in.</p>
                      <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-12 gap-2 border-slate-200 hover:bg-slate-50">
                        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                        Sign in with Google
                      </Button>
                    </div>
                    <div className="hidden md:flex flex-col items-center border-l pl-6 border-slate-100">
                      <p className="text-slate-400 text-sm italic">Or continue as guest below</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea id="address" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={3} placeholder="Apartment, Street, Area..." />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" required value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input id="pincode" required value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <Truck className="h-6 w-6 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-700">Cash/Payment on Delivery</p>
                      <p className="text-xs text-slate-500">Pay after installation. Free maintenance included.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" disabled={isLoading} className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/95 shadow-lg shadow-primary/20">
                {isLoading ? "Processing Order..." : "Confirm Rental Booking"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-none shadow-md overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={`${item.productId}-${item.planId}`} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.productData.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-medium">{item.quantity} x {item.planData?.name || "Monthly"}</p>
                      </div>
                      <span className="text-sm font-black text-slate-700">
                        ₹{((item.planData?.base_price || item.productData.price_per_month) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>GST (18%)</span>
                    <span className="font-bold">₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Deposit</span>
                    <span className="font-bold">₹{totalDeposit.toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-baseline">
                  <span className="font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-primary">₹{total.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-[10px] text-blue-700 font-medium leading-relaxed">
                  Free delivery and installation will be scheduled within 24-48 hours of booking confirmation.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
