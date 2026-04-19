"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OptionalFieldsToggle } from "./optional-fields-toggle";
import { Loader2, AlertCircle } from "lucide-react";
import type { Order } from "@/lib/intax/types";

export function IntaxOrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<string[]>([
    "order_number",
    "account_name",
    "order_date",
    "total_amount",
    "status",
  ]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/intax/orders?limit=100");

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field: string) => {
    setVisibleFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field],
    );
  };

  const allFields = orders.length > 0
    ? Object.keys(orders[0] || {})
    : [
        "id",
        "order_number",
        "account_name",
        "order_date",
        "delivery_date",
        "total_amount",
        "status",
        "notes",
        "created_at",
        "updated_at",
      ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-2">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-red-900">Error</p>
          <p className="text-red-700 text-sm">{error}</p>
          <Button size="sm" variant="outline" onClick={fetchOrders} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Intax Orders</h2>
        <Button onClick={fetchOrders} variant="outline">
          Refresh
        </Button>
      </div>

      <OptionalFieldsToggle
        allFields={allFields}
        visibleFields={visibleFields}
        onToggle={handleToggle}
        title="Show Optional Fields"
      />

      {orders.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100 border-b">
              <tr>
                {visibleFields.map((field) => (
                  <th
                    key={field}
                    className="px-4 py-2 text-left text-sm font-semibold text-slate-900"
                  >
                    {field.replace(/_/g, " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-slate-50">
                  {visibleFields.map((field) => (
                    <td
                      key={`${order.id}-${field}`}
                      className="px-4 py-3 text-sm text-slate-700"
                    >
                      {renderFieldValue(
                        order[field as keyof Order],
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function renderFieldValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
