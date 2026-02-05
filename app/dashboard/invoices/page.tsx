import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import Link from "next/link"

export default async function InvoicesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <p className="text-muted-foreground">View and download your invoices</p>
      </div>

      {invoices && invoices.length > 0 ? (
        <div className="grid gap-4">
          {invoices.map((invoice: any) => (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()} • Due Date:{" "}
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{Number.parseFloat(invoice.total_amount).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        GST: ₹{Number.parseFloat(invoice.gst_amount).toFixed(2)}
                      </p>
                    </div>
                    <Badge
                      className={
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : invoice.status === "pending"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {invoice.status}
                    </Badge>
                    <Button size="icon" variant="outline" asChild>
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground text-center mb-6">Your invoices will appear here once generated</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
