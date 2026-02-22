"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@/lib/hooks/use-supabase";
import { getFallbackImages } from "@/lib/supabase/storage"; // Added getFallbackImages import
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
import { Calendar, Package } from "lucide-react";
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

  const [formData, setFormData] = useState({
    startMonth: "",
    durationMonths: 1,
    rentalType: "monthly",
    quantity: 1,
    deliveryAddress: profile?.address || "",
    deliveryCity: profile?.city || "",
    deliveryState: profile?.state || "",
    deliveryPincode: profile?.pincode || "",
    notes: "",
  });

  const calculatePrice = () => {
    if (!formData.startMonth || !formData.durationMonths) {
      return { subtotal: 0, gstAmount: 0, total: 0, deposit: 0, discount: 0 };
    }

    // Calculate discount based on duration
    let discount = 0;
    if (formData.durationMonths >= 12) discount = 20;
    else if (formData.durationMonths >= 6) discount = 15;
    else if (formData.durationMonths >= 3) discount = 10;

    const basePrice = product.price_per_month * formData.durationMonths *
      formData.quantity;
    const discountAmount = (basePrice * discount) / 100;
    const subtotal = basePrice - discountAmount;
    const gstAmount = subtotal * 0.18;
    const total = subtotal + gstAmount;
    const deposit = product.deposit_amount * formData.quantity;

    return { subtotal, gstAmount, total, deposit, discount, discountAmount };
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

    // Calculate start and end dates from start month
    const startDate = new Date(formData.startMonth + "-01");
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + formData.durationMonths);

    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        product_id: product.id,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        rental_type: formData.rentalType,
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
      });

      if (error) throw error;

      router.push("/dashboard/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  const { subtotal, gstAmount, total, deposit, discount, discountAmount } =
    calculatePrice();

  // Get current month in YYYY-MM format for min value
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <img
                src={product.image_url && product.image_url.trim() !== ""
                  ? product.image_url
                  : getFallbackImages(product.category)[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{product.name}</h3>
              <p className="text-muted-foreground">{product.capacity}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Features:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {product.features?.map((feature: string, index: number) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-medium">Monthly Rate:</span>
                <span className="text-lg font-semibold text-primary">
                  ₹{product.price_per_month}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Deposit:</span>
                <span>₹{product.deposit_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Rental Booking</CardTitle>
            <CardDescription>
              Select your rental duration and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startMonth">Start Month</Label>
                  <div className="relative">
                    <Input
                      id="startMonth"
                      type="month"
                      required
                      value={formData.startMonth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startMonth: e.target.value,
                        })}
                      min={currentMonth}
                    />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationMonths">Duration (Months)</Label>
                  <Select
                    value={formData.durationMonths.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        durationMonths: Number.parseInt(value),
                      })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months (10% off)</SelectItem>
                      <SelectItem value="6">6 Months (15% off)</SelectItem>
                      <SelectItem value="12">12 Months (20% off)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.available_quantity}
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number.parseInt(e.target.value),
                      })}
                  />
                  <Package className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Any special delivery instructions or preferences..."
                />
              </div>

              {subtotal > 0 && (
                <div className="space-y-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <h4 className="font-semibold text-lg">Price Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>
                        Base Price ({formData.durationMonths} months):
                      </span>
                      <span>
                        ₹{(product.price_per_month * formData.durationMonths *
                          formData.quantity).toFixed(2)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount ({discount}%):</span>
                        <span>-₹{discountAmount?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t-2">
                      <span>Total Amount:</span>
                      <span className="text-primary">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-orange-600 dark:text-orange-400 pt-2 border-t">
                      <span className="font-medium">Refundable Deposit:</span>
                      <span className="font-semibold">
                        ₹{deposit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : user
                  ? "Confirm Monthly Rental"
                  : "Login to Book"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
