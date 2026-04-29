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
import { Badge, CheckCircle2, CreditCard, Link, MapPin, Truck, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const { items, clearCart, itemCount, subtotal, totalDeposit } = useCart();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);

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
    async function getUserData() {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          // Pre-fill email immediately
          setFormData(prev => ({ ...prev, email: user.email || "" }));

          // 1. Fetch saved addresses
          const { data: addresses } = await supabase
            .from("user_addresses")
            .select("*")
            .eq("user_id", user.id)
            .order('is_default', { ascending: false });

          if (addresses && addresses.length > 0) {
            setSavedAddresses(addresses);
            setShowNewAddressForm(false);
            const defaultAddr = addresses[0];
            setSelectedAddressId(defaultAddr.id);
            setFormData(prev => ({
              ...prev,
              name: defaultAddr.full_name,
              email: user.email || prev.email || "",
              phone: defaultAddr.phone,
              address: defaultAddr.address,
              city: defaultAddr.city,
              state: defaultAddr.state,
              pincode: defaultAddr.pincode,
            }));
          } else {
            // 2. Fallback to profile
            const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            if (profile) {
              setFormData(prev => ({
                ...prev,
                name: profile.full_name || user.user_metadata?.full_name || "",
                email: user.email || prev.email || "",
                phone: profile.phone || "",
                address: profile.address || "",
                city: profile.city || "",
                state: profile.state || "",
                pincode: profile.pincode || "",
              }));
            }
          }
        }
      }
    }
    getUserData();
  }, [supabase]);

  // Pincode Lookup Logic
  const [pincodeResults, setPincodeResults] = useState<any[]>([]);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  useEffect(() => {
    if (formData.pincode.length === 6) {
      lookupPincode(formData.pincode);
    } else {
      setPincodeResults([]);
    }
  }, [formData.pincode]);

  const lookupPincode = async (code: string) => {
    setIsPincodeLoading(true);
    try {
      const response = await fetch(`https://pincode.deno.dev/${code}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setPincodeResults(data);
        // Auto-fill city and state from first result
        setFormData(prev => ({
          ...prev,
          city: data[0].district,
          state: data[0].state,
        }));
      }
    } catch (err) {
      console.error("Pincode lookup failed:", err);
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const handleSelectLocation = (loc: any) => {
    setFormData(prev => ({
      ...prev,
      address: `${loc.vpo}, ${prev.address}`.replace(/undefined, /, "").trim(),
      city: loc.district,
      state: loc.state,
    }));
    setPincodeResults([]);
  };

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setShowNewAddressForm(false);
    setFormData({
      ...formData,
      name: addr.full_name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
  };

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
      const firstItem = items[0];
      const now = new Date();
      const startDate = now.toISOString().split('T')[0];
      
      // Calculate a default end date (e.g., 3 months from now)
      const endDateDate = new Date();
      endDateDate.setMonth(now.getMonth() + 3);
      const endDate = endDateDate.toISOString().split('T')[0];

      const { data: booking, error: bookingError } = await supabase.from("bookings").insert({
        user_id: user?.id, // Note: This must be a valid UUID if NOT NULL in DB
        product_id: firstItem.productId,
        start_date: startDate,
        end_date: endDate,
        rental_type: firstItem.planData?.name || "Monthly",
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
        await supabase.from("bookings").update({
          notes: `Items: ${JSON.stringify(itemData)}. Guest Info: ${formData.email}, ${formData.phone}`
        }).eq("id", booking.id);
      }

      // 3. Save as new address if user is logged in and using a new form
      if (user && showNewAddressForm) {
        await supabase.from("user_addresses").insert({
          user_id: user.id,
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          label: "Saved Address",
        });
      }

      setIsSuccess(true);

      // 4. Fire-and-forget ERP sync (create Lead in Intax)
      fetch('/api/erp/sync-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: booking.id,
          customer: { name: formData.name, email: formData.email, phone: formData.phone },
          address: { address: formData.address, city: formData.city, state: formData.state, pincode: formData.pincode },
          items: items.map(item => ({
            product_name: item.productData.name,
            plan_name: item.planData?.name,
            seasonal_plan_id: item.planId,
            quantity: item.quantity,
            unit_price: item.planData?.base_price || item.productData.price_per_month,
          })),
          totals: { subtotal, gst, totalDeposit, total },
        }),
      }).catch(err => console.warn('[erp-sync] Lead sync failed, queued for retry:', err));

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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Information
                  </CardTitle>
                  {user && savedAddresses.length > 0 && !showNewAddressForm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewAddressForm(true)}
                      className="text-primary font-bold text-xs"
                    >
                      + Add New Address
                    </Button>
                  )}
                  {user && showNewAddressForm && savedAddresses.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-slate-500 font-bold text-xs"
                    >
                      Cancel
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Saved Addresses Section */}
                  {user && savedAddresses.length > 0 && !showNewAddressForm && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id
                            ? "border-primary bg-blue-50/50 shadow-md"
                            : "border-slate-100 bg-white hover:border-slate-200"
                            }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {addr.label || "Home"}
                            </span>
                            {selectedAddressId === addr.id && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="font-bold text-slate-900 text-sm mb-1">{addr.full_name}</p>
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                            {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-slate-400 text-[10px] mt-2 font-medium">{addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual Form Section - Always show and pre-fill */}
                  <div className="space-y-4">
                    {/* Pincode Section - Moved to top for better UX */}
                    <div className="space-y-2 relative">
                      <Label htmlFor="pincode">Pincode (Auto-fills City & State)</Label>
                      <div className="relative">
                        <Input
                          id="pincode"
                          required
                          maxLength={6}
                          value={formData.pincode}
                          onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                          placeholder="e.g. 122003"
                          className="text-lg tracking-widest font-mono h-12"
                        />
                        {isPincodeLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                          </div>
                        )}
                      </div>

                      {/* Pincode Results Dropdown */}
                      {pincodeResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Select Area / Location
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {pincodeResults.map((loc, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectLocation(loc)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors group flex flex-col"
                              >
                                <span className="text-sm font-bold text-slate-900 group-hover:text-primary">{loc.vpo}</span>
                                <span className="text-[10px] text-slate-500">{loc.district}, {loc.state}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
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
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" required value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {((user && savedAddresses.length > 0 && !showNewAddressForm) || formData.pincode.length === 6) && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-none shadow-xl overflow-hidden pt-0 bg-white/80 backdrop-blur-xl">
              <CardHeader className="bg-slate-900 text-white py-6">
                <CardTitle className="text-xl font-black flex items-center justify-between">
                  Order Summary
                  <Badge className="bg-primary/20 text-primary border-none font-bold">
                    {itemCount} Items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-6">
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {items.map(item => (
                      <div key={`${item.productId}-${item.planId}`} className="flex justify-between items-start gap-4 group">
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                            {item.productData.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                              {item.quantity} x {item.planData?.name || "Monthly"}
                            </p>
                            {item.productData.deposit_amount && item.productData.deposit_amount > 0 && (
                              <Badge variant="outline" className="text-[8px] py-0 h-4 bg-orange-50 text-orange-600 border-orange-100 font-black">
                                +Deposit
                              </Badge>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-black text-slate-900">
                          ₹{((item.planData?.base_price || item.productData.price_per_month) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subtotal</span>
                      <span className="text-sm font-black text-slate-900">₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">GST (18%)</span>
                      <span className="text-sm font-black text-slate-900">₹{gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-xl border border-orange-100/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Security Deposit</span>
                        <span className="text-[9px] text-orange-400 font-bold uppercase">100% Refundable</span>
                      </div>
                      <span className="text-sm font-black text-orange-600">₹{totalDeposit.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-dashed border-slate-200">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Total Payable</span>
                        <span className="text-[10px] text-primary font-bold">Includes GST & Deposit</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className="text-sm font-bold text-slate-400">₹</span>
                          <span className="text-4xl font-black text-primary leading-none tracking-tight">
                            {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-3">
                    <Truck className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase tracking-tighter">
                      Free delivery and installation will be scheduled within 24-48 hours of booking confirmation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </main >
  );
}
