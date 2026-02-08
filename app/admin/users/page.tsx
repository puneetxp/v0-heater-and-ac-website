import { checkAdminAccess } from "@/lib/check-admin"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  await checkAdminAccess()
  const supabase = await createServerClient()

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
          <p className="text-slate-600 mt-1">View and manage all registered users</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900">{user.full_name || "No Name"}</h3>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                    {user.role || "user"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{user.address}</span>
                  </div>
                )}

                {user.gst_number && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-medium">GST:</span>
                    <span>{user.gst_number}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}

        {(!users || users.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">No users found</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
