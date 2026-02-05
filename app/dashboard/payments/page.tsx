import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from "lucide-react"

export default async function PaymentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: payments } = await supabase
    .from("payments")
    .select("*, invoices(invoice_number)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payment History</h2>
        <p className="text-muted-foreground">View your payment transactions</p>
      </div>

      {payments && payments.length > 0 ? (
        <div className="grid gap-4">
          {payments.map((payment: any) => (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {payment.invoices?.invoice_number || `Payment #${payment.id.slice(0, 8)}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()} • {payment.payment_method}
                      </p>
                      {payment.transaction_id && (
                        <p className="text-xs text-muted-foreground">Transaction ID: {payment.transaction_id}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold">₹{Number.parseFloat(payment.amount).toFixed(2)}</p>
                    <Badge
                      className={
                        payment.status === "completed"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : payment.status === "pending"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CreditCard className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No payments yet</h3>
            <p className="text-muted-foreground text-center">Your payment history will appear here</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
