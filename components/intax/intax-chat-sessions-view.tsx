"use client";

import { useState } from "react";
import useSWR from "swr";
import type { ApiChatSession } from "@/lib/intax/types";
import { OptionalFieldsToggle } from "./optional-fields-toggle";
import { AlertCircle, Loader2, MessageSquare } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ChatFieldsState {
  channel: boolean;
  channel_id: boolean;
  user_id: boolean;
  lead_id: boolean;
  book_id: boolean;
}

export function IntaxChatSessionsView() {
  const { data: sessions, error, isLoading } = useSWR<ApiChatSession[]>(
    "/api/intax/chat-sessions",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const [showFields, setShowFields] = useState<ChatFieldsState>({
    channel: true,
    channel_id: false,
    user_id: false,
    lead_id: true,
    book_id: false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
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
            <h3 className="font-semibold text-destructive">Error Loading Chat Sessions</h3>
            <p className="text-sm text-destructive/80 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Optional Fields Toggle */}
      <OptionalFieldsToggle
        fields={showFields}
        onToggle={(field) =>
          setShowFields((prev) => ({ ...prev, [field]: !prev[field] }))
        }
      />

      {/* Chat Sessions Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                {showFields.channel && (
                  <th className="px-4 py-3 text-left font-semibold">Channel</th>
                )}
                {showFields.channel_id && (
                  <th className="px-4 py-3 text-left font-semibold">Channel ID</th>
                )}
                {showFields.lead_id && (
                  <th className="px-4 py-3 text-left font-semibold">Lead ID</th>
                )}
                {showFields.user_id && (
                  <th className="px-4 py-3 text-left font-semibold">Agent ID</th>
                )}
                {showFields.book_id && (
                  <th className="px-4 py-3 text-left font-semibold">Book ID</th>
                )}
                <th className="px-4 py-3 text-left font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sessions && sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      #{session.id}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          session.status
                        )}`}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {session.status}
                      </span>
                    </td>
                    {showFields.channel && (
                      <td className="px-4 py-3 font-medium">{session.channel}</td>
                    )}
                    {showFields.channel_id && (
                      <td className="px-4 py-3 text-xs font-mono">
                        {session.channel_id || <span className="text-muted-foreground">—</span>}
                      </td>
                    )}
                    {showFields.lead_id && (
                      <td className="px-4 py-3">
                        {session.lead_id ? (
                          <span className="text-primary font-semibold">#{session.lead_id}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                    {showFields.user_id && (
                      <td className="px-4 py-3">
                        {session.user_id ? (
                          <span className="text-muted-foreground">#{session.user_id}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                    {showFields.book_id && (
                      <td className="px-4 py-3">
                        {session.book_id ? (
                          <span className="text-muted-foreground">#{session.book_id}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No chat sessions yet
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
