import { checkAdminAccess } from "@/lib/check-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  await checkAdminAccess()

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details displayed on invoices and communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="ComfortRent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst-number">GST Number</Label>
              <Input id="gst-number" placeholder="Enter GST number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Enter company address" rows={3} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hello@comfortrent.com" />
            </div>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Settings</CardTitle>
          <CardDescription>Configure default pricing and tax rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gst-rate">GST Rate (%)</Label>
              <Input id="gst-rate" type="number" defaultValue="18" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="security-deposit">Security Deposit (₹)</Label>
              <Input id="security-deposit" type="number" placeholder="5000" />
            </div>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
