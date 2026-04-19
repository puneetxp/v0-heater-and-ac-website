"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OptionalFieldsToggle } from "./optional-fields-toggle";
import { Loader2, AlertCircle } from "lucide-react";
import type { ApiProduct } from "@/lib/intax/types";

export function IntaxProductsView() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<string[]>([
    "name",
    "category",
    "description",
    "status",
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/intax/products?limit=100");

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
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

  const allFields = products.length > 0
    ? Object.keys(products[0] || {})
    : [
        "id",
        "name",
        "category",
        "description",
        "sku",
        "price",
        "status",
        "stock_quantity",
        "reorder_level",
        "unit_of_measurement",
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
          <Button size="sm" variant="outline" onClick={fetchProducts} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Intax Products</h2>
        <Button onClick={fetchProducts} variant="outline">
          Refresh
        </Button>
      </div>

      <OptionalFieldsToggle
        allFields={allFields}
        visibleFields={visibleFields}
        onToggle={handleToggle}
        title="Show Optional Fields"
      />

      {products.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No products found</p>
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
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-slate-50">
                  {visibleFields.map((field) => (
                    <td
                      key={`${product.id}-${field}`}
                      className="px-4 py-3 text-sm text-slate-700"
                    >
                      {renderFieldValue(
                        product[field as keyof Product],
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
