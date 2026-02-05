import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: invoice } = await supabase.from("invoices").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!invoice) redirect("/dashboard/invoices")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/invoices">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Link>
        </Button>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-12">
          {/* Invoice Header */}
          <div className="flex items-start justify-between mb-12">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">ComfortRent</h1>
              <p className="text-muted-foreground">
                123 Business District
                <br />
                Mumbai, Maharashtra 400001
                <br />
                India
                <br />
                GST: 27AAAAA0000A1Z5
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
              <p className="text-muted-foreground">
                <strong>Invoice #:</strong> {invoice.invoice_number}
                <br />
                <strong>Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}
                <br />
                <strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
            <div className="text-muted-foreground">
              <p className="font-medium text-foreground">{profile?.full_name || user.email}</p>
              {profile?.company_name && <p>{profile.company_name}</p>}
              {profile?.address && (
                <>
                  <p>{profile.address}</p>
                  <p>
                    {profile.city}, {profile.state} - {profile.pincode}
                  </p>
                </>
              )}
              {profile?.gst_number && <p>GST: {profile.gst_number}</p>}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-12">
            <table className="w-full">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-3 font-semibold">Description</th>
                  <th className="text-right py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">
                    <p className="font-medium">Rental Services</p>
                    <p className="text-sm text-muted-foreground">As per booking details</p>
                  </td>
                  <td className="text-right py-4">₹{Number.parseFloat(invoice.subtotal).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-64 space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₹{Number.parseFloat(invoice.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">GST ({invoice.gst_rate}%):</span>
                <span className="font-medium">₹{Number.parseFloat(invoice.gst_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-300">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold">₹{Number.parseFloat(invoice.total_amount).toFixed(2)}</span>
              </div>
              <div className="py-2 px-3 rounded bg-primary/10">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="font-semibold uppercase">{invoice.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-2">For any queries, contact us at hello@comfortrent.com or +91 98765 43210</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
