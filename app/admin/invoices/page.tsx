import { checkAdminAccess } from "@/lib/check-admin"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminInvoicesPage() {
  await checkAdminAccess()
  const supabase = await createServerClient()

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, bookings(*, profiles(full_name, email))")
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoices Management</h1>
          <p className="text-slate-600 mt-1">View and manage all invoices</p>
        </div>
      </div>

      <div className="space-y-4">
        {invoices?.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900">{invoice.invoice_number}</h3>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {invoice.bookings?.profiles?.full_name || "Unknown"} •{" "}
                      {invoice.bookings?.profiles?.email || "No email"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Issued: {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">₹{invoice.total_amount}</p>
                    <p className="text-sm text-slate-500">Total Amount</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!invoices || invoices.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">No invoices found</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
