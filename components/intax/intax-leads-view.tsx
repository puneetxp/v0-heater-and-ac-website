"use client";

import { useState } from "react";
import useSWR from "swr";
import type { ApiLead } from "@/lib/intax/types";
import { intaxGetAll, intaxCreate, intaxUpdate, intaxDelete } from "@/lib/intax/client";
import { AlertCircle, Loader2, Plus, Phone, Mail, Trash2 } from "lucide-react";

interface LeadFieldsState {
  phone: boolean;
  email: boolean;
  notes: boolean;
  status: boolean;
  book_id: boolean;
}

export function IntaxLeadsView() {
  const { data: leads, error, isLoading, mutate } = useSWR<ApiLead[]>(
    "intax_leads",
    () => intaxGetAll<ApiLead>("lead"),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const [showFields, setShowFields] = useState<LeadFieldsState>({
    phone: true,
    email: true,
    notes: false,
    status: true,
    book_id: false,
  });

  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    status: "new",
    notes: "",
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newLead.name) {
      alert("Lead name is required");
      return;
    }

    setIsCreating(true);
    try {
      const res = await intaxCreate<ApiLead>("lead", newLead);

      if (!res) {
        throw new Error("Failed to create lead");
      }

      setNewLead({ name: "", phone: "", email: "", status: "new", notes: "" });
      mutate();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await intaxUpdate<ApiLead>("lead", id, { status: newStatus });
      if (!res) throw new Error("Failed to update status");
      mutate();
    } catch (error: any) {
      alert(`Error updating status: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await intaxDelete<ApiLead>("lead", id);
      if (!res) throw new Error("Failed to delete lead");
      mutate();
    } catch (error: any) {
      alert(`Error deleting lead: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">Error Loading Leads</h3>
            <p className="text-sm text-destructive/80 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Lead Section */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Lead</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Lead name *"
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            className="px-3 py-2 border rounded-md text-sm"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            className="px-3 py-2 border rounded-md text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            className="px-3 py-2 border rounded-md text-sm"
          />
          <select
            value={newLead.status}
            onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <textarea
          placeholder="Notes"
          value={newLead.notes}
          onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm mb-4"
          rows={2}
        />
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Creating..." : "Create Lead"}
        </button>
      </div>



      {/* Leads Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                {showFields.phone && (
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                )}
                {showFields.email && (
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                )}
                {showFields.status && (
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                )}
                {showFields.notes && (
                  <th className="px-4 py-3 text-left font-semibold">Notes</th>
                )}
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads && leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      #{lead.id}
                    </td>
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    {showFields.phone && (
                      <td className="px-4 py-3">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                    {showFields.email && (
                      <td className="px-4 py-3">
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Mail className="h-4 w-4" />
                            {lead.email}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                    {showFields.status && (
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className="px-2 py-1 text-xs font-medium rounded-md border-0 bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 outline-none ring-1 ring-blue-200"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    )}
                    {showFields.notes && (
                      <td className="px-4 py-3 text-xs max-w-xs truncate">
                        {lead.notes || <span className="text-muted-foreground">—</span>}
                      </td>
                    )}
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        title="Delete Lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No leads yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
