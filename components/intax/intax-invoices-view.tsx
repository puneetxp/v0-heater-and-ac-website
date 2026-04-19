"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OptionalFieldsToggle } from "./optional-fields-toggle";
import { Loader2, AlertCircle } from "lucide-react";
import type { Invoice } from "@/lib/intax/types";

export function IntaxInvoicesView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<string[]>([
    "invoice_number",
    "account_name",
    "invoice_date",
    "total_amount",
    "status",
  ]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/intax/invoices?limit=100");

      if (!res.ok) {
        throw new Error("Failed to fetch invoices");
      }

      const data = await res.json();
      setInvoices(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch invoices");
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

  const allFields = invoices.length > 0
    ? Object.keys(invoices[0] || {})
    : [
        "id",
        "invoice_number",
        "account_name",
        "invoice_date",
        "due_date",
        "total_amount",
        "paid_amount",
        "status",
        "payment_terms",
        "notes",
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
          <Button size="sm" variant="outline" onClick={fetchInvoices} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Intax Invoices</h2>
        <Button onClick={fetchInvoices} variant="outline">
          Refresh
        </Button>
      </div>

      <OptionalFieldsToggle
        allFields={allFields}
        visibleFields={visibleFields}
        onToggle={handleToggle}
        title="Show Optional Fields"
      />

      {invoices.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No invoices found</p>
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
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-slate-50">
                  {visibleFields.map((field) => (
                    <td
                      key={`${invoice.id}-${field}`}
                      className="px-4 py-3 text-sm text-slate-700"
                    >
                      {renderFieldValue(
                        invoice[field as keyof Invoice],
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
