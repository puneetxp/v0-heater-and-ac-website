import { checkAdminAccess } from "@/lib/check-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntaxProductsView } from "@/components/intax/intax-products-view";
import { IntaxInvoicesView } from "@/components/intax/intax-invoices-view";
import { IntaxOrdersView } from "@/components/intax/intax-orders-view";

export default async function IntaxPage() {
  await checkAdminAccess();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Intax Integration</h1>
        <p className="text-slate-600 mt-1">
          View and manage your business data synced from Intax ERP system
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <IntaxProductsView />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <IntaxInvoicesView />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <IntaxOrdersView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
