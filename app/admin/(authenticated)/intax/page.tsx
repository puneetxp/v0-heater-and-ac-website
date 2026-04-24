import { checkAdminAccess } from "@/lib/check-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntaxProductsView } from "@/components/intax/intax-products-view";
import { IntaxServicesView } from "@/components/intax/intax-services-view";
import { IntaxInvoicesView } from "@/components/intax/intax-invoices-view";
import { IntaxOrdersView } from "@/components/intax/intax-orders-view";
import { IntaxLeadsView } from "@/components/intax/intax-leads-view";
import { IntaxChatSessionsView } from "@/components/intax/intax-chat-sessions-view";

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

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-6">
          <IntaxLeadsView />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <IntaxChatSessionsView />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <IntaxProductsView />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <IntaxServicesView />
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
