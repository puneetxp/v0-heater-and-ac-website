import { createServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Calendar, Clock, MapPin, Package } from "lucide-react";
import { getFallbackImages } from "@/lib/supabase/storage";

export default async function BookingsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      *,
      products (name, category, capacity, image_url)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
          <p className="text-muted-foreground">
            View and manage your equipment rentals
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/#products">Book New Equipment</Link>
        </Button>
      </div>

      {bookings && bookings.length > 0
        ? (
          <div className="grid gap-6">
            {bookings.map((booking: any) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                        <img
                          src={booking.products.image_url &&
                              booking.products.image_url.trim() !== ""
                            ? booking.products.image_url
                            : getFallbackImages(booking.products.category)[0]}
                          alt={booking.products.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {booking.products.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {booking.products.category} •{" "}
                          {booking.products.capacity}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Booking #{booking.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={booking.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : booking.status === "confirmed"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        : booking.status === "completed"
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-100"}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Rental Period
                      </p>
                      <p className="font-medium">
                        {new Date(booking.start_date).toLocaleDateString()} -
                        {" "}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">{booking.quantity} unit(s)</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="font-medium text-lg">
                        ₹{Number.parseFloat(booking.total_amount).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Deposit</p>
                      <p className="font-medium">
                        ₹{Number.parseFloat(booking.deposit_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </p>
                    <p className="text-sm mt-1">
                      {booking.delivery_address}, {booking.delivery_city},{" "}
                      {booking.delivery_state} - {booking.delivery_pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
        : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Start renting equipment to see your bookings here
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/#products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
