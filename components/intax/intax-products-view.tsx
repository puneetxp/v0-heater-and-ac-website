"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Trash2, RefreshCw } from "lucide-react";
import type { ApiProduct } from "@/lib/intax/types";
import { intaxGetAll, intaxUpdate, intaxDelete } from "@/lib/intax/client";

export function IntaxProductsView() {
  const { data: products, error, isLoading, mutate } = useSWR<ApiProduct[]>(
    "intax_products",
    () => intaxGetAll<ApiProduct>("product"),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const [visibleFields] = useState<string[]>([
    "name",
    "head",
    "price",
    "status",
  ]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await intaxUpdate<ApiProduct>("product", id, { status: newStatus });
      if (!res) throw new Error("Failed to update product");
      mutate();
    } catch (error: any) {
      alert(`Error updating product: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await intaxDelete<ApiProduct>("product", id);
      if (!res) throw new Error("Failed to delete product");
      mutate();
    } catch (error: any) {
      alert(`Error deleting product: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-900">Error Loading Products</p>
          <p className="text-red-700 text-sm">{error.message || "Failed to fetch products"}</p>
          <Button size="sm" variant="outline" onClick={() => mutate()} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
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
        <Button onClick={() => mutate()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No products found</p>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">ID</th>
                  {visibleFields.map((field) => (
                    <th
                      key={field}
                      className="px-4 py-3 text-left font-semibold text-slate-900"
                    >
                      {field.replace(/_/g, " ").toUpperCase()}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold text-slate-900">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">#{product.id}</td>
                    {visibleFields.map((field) => (
                      <td
                        key={`${product.id}-${field}`}
                        className="px-4 py-3 text-slate-700"
                      >
                        {field === "status" ? (
                          <select
                            value={product.status}
                            onChange={(e) => handleUpdateStatus(product.id, e.target.value)}
                            className="px-2 py-1 text-xs font-medium rounded-md border-0 bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 outline-none ring-1 ring-blue-200"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="draft">Draft</option>
                          </select>
                        ) : field === "price" ? (
                          <span className="font-medium text-slate-900">
                            ₹{product.price?.toLocaleString() || "0"}
                          </span>
                        ) : (
                          renderFieldValue(product[field as keyof ApiProduct])
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

