import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import Link from "next/link"

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      products (name, category, capacity, image_url)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
          <p className="text-muted-foreground">Manage your recurring rentals</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/#products">Add Subscription</Link>
        </Button>
      </div>

      {subscriptions && subscriptions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {subscriptions.map((subscription: any) => (
            <Card key={subscription.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{subscription.products.name}</CardTitle>
                  <Badge
                    className={
                      subscription.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : subscription.status === "paused"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {subscription.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src={subscription.products.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={subscription.products.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan Type</p>
                    <p className="font-medium capitalize">{subscription.plan_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Amount</p>
                    <p className="font-medium">₹{Number.parseFloat(subscription.total_amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(subscription.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Billing</p>
                    <p className="font-medium">{new Date(subscription.next_billing_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                    Pause
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 bg-transparent" size="sm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <RefreshCw className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No active subscriptions</h3>
            <p className="text-muted-foreground text-center mb-6">
              Subscribe to regular rentals and never worry about renewals
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/#products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
