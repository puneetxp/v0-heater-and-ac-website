"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@/lib/hooks/use-supabase";
import { getFallbackImages } from "@/lib/supabase/storage";
import { sendBookingToTelegram } from "@/lib/telegram";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Package, Flame, Zap, RotateCcw, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormProps {
  product: any;
  user: any;
  profile: any;
}

export function BookingForm({ product, user, profile }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();

  // State for loaded plans
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | number | null>(null);

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0], // Exact date instead of month
    durationMonths: 1, // Will be overridden if seasonal
    rentalType: "seasonal", // Default to seasonal as preferred option
    quantity: 1,
    deliveryAddress: profile?.address || "",
    deliveryCity: profile?.city || "",
    deliveryState: profile?.state || "",
    deliveryPincode: profile?.pincode || "",
    notes: "",
  });

  // Fetch seasonal plans for the product
  useEffect(() => {
    const fetchPlans = async () => {
      if (!supabase || !product?.id) return;
      try {
        const { data, error: plansErr } = await supabase
          .from("seasonal_plans")
          .select("*")
          .eq("product_id", product.id)
          .eq("is_active", true)
          .order("base_price", { ascending: true });

        if (plansErr) throw plansErr;

        if (data && data.length > 0) {
          setPlans(data);
          setSelectedPlanId(data[0].id);
          setFormData((prev) => ({
            ...prev,
            rentalType: "seasonal",
            durationMonths: data[0].duration_months,
          }));
        } else {
          // Fallback if no seasonal plans exist
          setFormData((prev) => ({
            ...prev,
            rentalType: "monthly",
            durationMonths: 1,
          }));
        }
      } catch (err) {
        console.error("[BookingForm] Error fetching plans:", err);
      }
    };
    fetchPlans();
  }, [supabase, product?.id]);

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find((p) => String(p.id) === String(planId));
    if (plan) {
      setFormData((prev) => ({
        ...prev,
        durationMonths: plan.duration_months,
      }));
    }
  };

  const selectedPlan = plans.find((p) => String(p.id) === String(selectedPlanId));

  const calculatePrice = () => {
    if (!formData.startDate) {
      return { subtotal: 0, gstAmount: 0, total: 0, deposit: 0, discount: 0, discountAmount: 0 };
    }

    if (formData.rentalType === "seasonal") {
      const selectedPlan = plans.find((p) => String(p.id) === String(selectedPlanId));
      if (!selectedPlan) {
        return { subtotal: 0, gstAmount: 0, total: 0, deposit: 0, discount: 0, discountAmount: 0 };
      }

      const subtotal = selectedPlan.base_price * formData.quantity;
      const gstAmount = subtotal * 0.18;
      const total = subtotal + gstAmount;
      const deposit = product.deposit_amount * formData.quantity;
      const discount = selectedPlan.discount_percentage || 0;

      return { subtotal, gstAmount, total, deposit, discount, discountAmount: 0 };
    } else {
      // Monthly custom duration rental
      let discount = 0;
      if (formData.durationMonths >= 12) discount = 20;
      else if (formData.durationMonths >= 6) discount = 15;
      else if (formData.durationMonths >= 3) discount = 10;

      const basePrice = product.price_per_month * formData.durationMonths * formData.quantity;
      const discountAmount = (basePrice * discount) / 100;
      const subtotal = basePrice - discountAmount;
      const gstAmount = subtotal * 0.18;
      const total = subtotal + gstAmount;
      const deposit = product.deposit_amount * formData.quantity;

      return { subtotal, gstAmount, total, deposit, discount, discountAmount };
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!user) {
      router.push(`/auth/login?redirect=/booking/${product.id}`);
      return;
    }

    const { subtotal, gstAmount, total, deposit } = calculatePrice();

    const startDate = new Date(formData.startDate);
    let endDate: Date;
    if (formData.rentalType === "seasonal" && selectedPlan?.valid_until) {
      endDate = new Date(selectedPlan.valid_until);
      const currentYear = new Date().getFullYear();
      if (endDate.getFullYear() < currentYear) {
        endDate.setFullYear(currentYear);
      }
    } else {
      endDate = new Date(startDate);
      const months = formData.durationMonths || 1;
      endDate.setMonth(endDate.getMonth() + months);
    }

    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      const { data, error: bookingErr } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          product_id: product.id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          rental_type: formData.rentalType,
          plan_id: formData.rentalType === "seasonal" ? selectedPlanId : null,
          quantity: formData.quantity,
          subtotal,
          gst_amount: gstAmount,
          total_amount: total,
          deposit_amount: deposit,
          delivery_address: formData.deliveryAddress,
          delivery_city: formData.deliveryCity,
          delivery_state: formData.deliveryState,
          delivery_pincode: formData.deliveryPincode,
          notes: formData.notes,
          status: "pending",
        })
        .select();

      if (bookingErr) throw bookingErr;

      // Send booking notification to Telegram
      if (data && data.length > 0) {
        const booking = data[0];
        const bookingData = {
          id: booking.id,
          customerName: profile?.full_name || user.email,
          customerPhone: profile?.phone || "Not provided",
          customerEmail: user.email,
          productType: product.name,
          rentalStartDate: startDate.toISOString().split("T")[0],
          rentalEndDate: endDate.toISOString().split("T")[0],
          quantity: formData.quantity,
          totalPrice: total,
          address: `${formData.deliveryAddress}, ${formData.deliveryCity}, ${formData.deliveryState} ${formData.deliveryPincode}`,
          notes: formData.notes,
        };

        sendBookingToTelegram(bookingData).catch((err) =>
          console.error("[v0] Failed to send Telegram notification:", err)
        );
      }

      router.push("/dashboard/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  const { subtotal, gstAmount, total, deposit, discount, discountAmount } =
    calculatePrice();

  // Get current exact date in YYYY-MM-DD format for min value
  const currentDate = new Date().toISOString().split("T")[0];

  // Calculate dynamic start & end dates
  const getDates = () => {
    if (!formData.startDate) return { start: null, end: null };
    const start = new Date(formData.startDate);
    if (isNaN(start.getTime())) return { start: null, end: null };
    
    let end: Date;
    if (formData.rentalType === "seasonal" && selectedPlan?.valid_until) {
      end = new Date(selectedPlan.valid_until);
      const currentYear = new Date().getFullYear();
      if (end.getFullYear() < currentYear) {
        end.setFullYear(currentYear);
      }
    } else {
      end = new Date(start);
      const months = formData.durationMonths || 1;
      end.setMonth(end.getMonth() + months);
    }
    return { start, end };
  };
  const { start: calculatedStart, end: calculatedEnd } = getDates();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Product Details Card */}
      <div>
        <Card className="shadow-lg border-slate-100 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="relative aspect-video rounded-xl overflow-hidden border shadow-sm">
              <img
                src={product.image_url && product.image_url.trim() !== ""
                  ? product.image_url
                  : getFallbackImages(product.category)[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-2xl font-bold text-slate-900">{product.name}</h3>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 uppercase tracking-widest font-black text-[10px] px-2.5 py-1">
                  Season: {product.season ? product.season.toUpperCase() : "YEAR ROUND"}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-slate-500">{product.capacity}</p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Key Features:</h4>
              <ul className="space-y-1.5 text-sm text-slate-500">
                {product.features?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-black">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2.5 pt-5 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-500">Monthly Rate:</span>
                <span className="text-lg font-black text-slate-950">
                  ₹{product.price_per_month}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-500">Security Deposit:</span>
                <span className="text-sm font-bold text-slate-950">₹{product.deposit_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Form Card */}
      <div>
        <Card className="shadow-xl border-slate-100">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle>Rental Booking</CardTitle>
            <CardDescription>
              Select your rental preference and exact billing dates
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Rental Type Selection (Preferred Season Plan first) */}
              {plans.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Rental Type</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const defaultPlan = plans[0];
                        setSelectedPlanId(defaultPlan.id);
                        setFormData({
                          ...formData,
                          rentalType: "seasonal",
                          durationMonths: defaultPlan.duration_months,
                        });
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                        formData.rentalType === "seasonal"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-black text-slate-900 text-sm">Seasonal Plan</span>
                        <Badge className="bg-primary text-white text-[10px] font-black py-0.5 px-2 uppercase tracking-wide animate-pulse">
                          PREFERABLE
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Pre-configured seasonal packages with up to {plans[0].discount_percentage || 15}% built-in savings.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          rentalType: "monthly",
                          durationMonths: 1,
                        });
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.rentalType === "monthly"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <span className="font-black text-slate-900 text-sm block mb-1.5">Custom Duration</span>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Select any custom duration from 1 to 12 months with flexible extensions.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Exact Dates & Duration Grid */}
              <div className="grid gap-4 md:grid-cols-2 pt-2">
                
                {/* Duration Picker */}
                {formData.rentalType === "seasonal" ? (
                  <div className="space-y-2">
                    <Label htmlFor="seasonalPlan" className="text-slate-700 font-bold text-sm">Select Season Plan</Label>
                    {plans.length > 0 && selectedPlanId ? (
                      <Select
                        key={selectedPlanId.toString()}
                        value={selectedPlanId.toString()}
                        onValueChange={handlePlanChange}
                      >
                        <SelectTrigger id="seasonalPlan" className="bg-white border-slate-200">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name} ({p.duration_months} M - ₹{p.base_price.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-10 w-full animate-pulse bg-slate-100 rounded-lg border border-slate-200" />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="durationMonths" className="text-slate-700 font-bold text-sm">Duration (Months)</Label>
                    <Select
                      value={formData.durationMonths.toString()}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          durationMonths: Number.parseInt(value),
                        })}
                    >
                      <SelectTrigger id="durationMonths" className="bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                          let label = `${m} Month${m > 1 ? 's' : ''}`;
                          if (m === 3) label += " (10% off)";
                          else if (m === 6) label += " (15% off)";
                          else if (m === 12) label += " (20% off)";
                          return (
                            <SelectItem key={m} value={m.toString()}>
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Exact Start Date Input */}
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-slate-700 font-bold text-sm">Start Date</Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startDate: e.target.value,
                        })}
                      min={currentDate}
                      className="bg-white border-slate-200 pr-10"
                    />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Exact Dates Banner (Dynamic Start and End Dates Shown) */}
              {calculatedStart && calculatedEnd && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between gap-4 text-sm font-semibold text-slate-700 shadow-inner animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Billing Start</span>
                    <span className="text-slate-900 font-black text-sm">
                      {calculatedStart.toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="hidden sm:block border-r border-slate-200" />
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Billing End</span>
                    <span className="text-slate-900 font-black text-sm text-primary">
                      {calculatedEnd.toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.available_quantity || 10}
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number.parseInt(e.target.value),
                      })}
                    className="bg-white border-slate-200"
                  />
                  <Package className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Delivery Address Fields */}
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryAddress: e.target.value,
                    })}
                  rows={3}
                  placeholder="Enter your complete delivery address"
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="deliveryCity">City</Label>
                  <Input
                    id="deliveryCity"
                    required
                    value={formData.deliveryCity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryCity: e.target.value,
                      })}
                    className="bg-white border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryState">State</Label>
                  <Input
                    id="deliveryState"
                    required
                    value={formData.deliveryState}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryState: e.target.value,
                      })}
                    className="bg-white border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryPincode">Pincode</Label>
                  <Input
                    id="deliveryPincode"
                    required
                    value={formData.deliveryPincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryPincode: e.target.value,
                      })}
                    className="bg-white border-slate-200"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Any special delivery instructions or preferences..."
                  className="bg-white border-slate-200"
                />
              </div>

              {/* Price Summary Banner */}
              {subtotal > 0 && (
                <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/[0.02] p-5 shadow-sm">
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Estimated Invoice Summary
                  </h4>
                  <div className="space-y-2 text-sm pt-2">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>
                        Rental Amount ({formData.durationMonths} Months × {formData.quantity}):
                      </span>
                      <span className="font-bold text-slate-800">
                        ₹{formData.rentalType === "seasonal" && selectedPlan
                          ? (selectedPlan.base_price * formData.quantity).toFixed(2)
                          : (product.price_per_month * formData.durationMonths * formData.quantity).toFixed(2)
                        }
                      </span>
                    </div>
                    {formData.rentalType === "monthly" && discount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                        <span>Discount ({discount}%):</span>
                        <span>-₹{discountAmount?.toFixed(2)}</span>
                      </div>
                    )}
                    {formData.rentalType === "seasonal" && selectedPlan && selectedPlan.discount_percentage > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                        <span>Built-in Season Discount ({selectedPlan.discount_percentage}%):</span>
                        <span>Included</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500 font-medium pt-1.5 border-t border-slate-100">
                      <span>Subtotal:</span>
                      <span className="font-bold text-slate-800">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>GST (18%):</span>
                      <span className="font-bold text-slate-800">₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-base pt-3 border-t-2 border-slate-100">
                      <span className="text-slate-900">Total Rental Amount:</span>
                      <span className="text-primary text-lg">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-orange-600 font-bold pt-2.5 border-t border-dashed border-slate-200">
                      <span className="font-bold">Refundable Security Deposit:</span>
                      <span className="font-black">
                        ₹{deposit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : user
                  ? "Confirm Rental Booking"
                  : "Login to Book"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
