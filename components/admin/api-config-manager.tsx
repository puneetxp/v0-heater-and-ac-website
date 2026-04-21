"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import type { ApiConfig } from "@/lib/types/api-config";
import { API_PROVIDERS } from "@/lib/types/api-config";

interface ApiConfigManagerProps {
  initialConfigs?: ApiConfig[];
}

export function ApiConfigManager({ initialConfigs = [] }: ApiConfigManagerProps) {
  const [configs, setConfigs] = useState<ApiConfig[]>(initialConfigs);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    provider: "intax" as keyof typeof API_PROVIDERS,
    api_key: "",
    book_id: "",
    is_enabled: true,
    description: "",
  });

  useEffect(() => {
    if (!initialConfigs.length) {
      fetchConfigs();
    }
  }, [initialConfigs]);

  const fetchConfigs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/api-configs");
      if (res.ok) {
        const data = await res.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error("Failed to fetch configs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        ...formData,
        book_id: formData.book_id ? parseInt(formData.book_id) : null,
      };

      const res = await fetch("/api/admin/api-configs", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          ...(editingId && { id: editingId }),
        }),
      });

      if (res.ok) {
        await fetchConfigs();
        setShowForm(false);
        setEditingId(null);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (config: ApiConfig) => {
    setFormData({
      name: config.name,
      provider: config.provider as keyof typeof API_PROVIDERS,
      api_key: config.api_key,
      book_id: config.book_id?.toString() || "",
      is_enabled: config.is_enabled,
      description: config.description || "",
    });
    setEditingId(config.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this API configuration?")) return;

    try {
      const res = await fetch(`/api/admin/api-configs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchConfigs();
      }
    } catch (error) {
      console.error("Failed to delete config:", error);
    }
  };

  const handleToggle = async (id: number, isEnabled: boolean) => {
    try {
      const res = await fetch("/api/admin/api-configs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_enabled: !isEnabled }),
      });
      if (res.ok) {
        await fetchConfigs();
      }
    } catch (error) {
      console.error("Failed to toggle config:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      provider: "intax",
      api_key: "",
      book_id: "",
      is_enabled: true,
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Configurations</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            resetForm();
            setShowForm(!showForm);
          }}
          variant={showForm ? "outline" : "default"}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add API"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit API Configuration" : "Add New API Configuration"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Production Intax"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Provider</label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value as keyof typeof API_PROVIDERS })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {Object.entries(API_PROVIDERS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">API Key</label>
                  <input
                    type="password"
                    required
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter API key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Book ID (Optional)</label>
                  <input
                    type="number"
                    value={formData.book_id}
                    onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Optional notes about this API configuration"
                  rows={2}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_enabled"
                  checked={formData.is_enabled}
                  onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_enabled" className="ml-2 text-sm font-medium">
                  Enable this API
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {isLoading && !configs.length ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : configs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              No API configurations yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          configs.map((config) => (
            <Card key={config.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{config.name}</h3>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {API_PROVIDERS[config.provider as keyof typeof API_PROVIDERS] || config.provider}
                      </span>
                      {config.book_id && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Book ID: {config.book_id}
                        </span>
                      )}
                    </div>
                    {config.description && (
                      <p className="text-sm text-slate-600 mb-2">{config.description}</p>
                    )}
                    <p className="text-xs text-slate-500">
                      Created: {new Date(config.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(config.id, config.is_enabled)}
                      className="p-2 hover:bg-slate-100 rounded-md transition"
                      title={config.is_enabled ? "Disable" : "Enable"}
                    >
                      {config.is_enabled ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(config)}
                      className="p-2 hover:bg-slate-100 rounded-md transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="p-2 hover:bg-red-100 rounded-md transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
