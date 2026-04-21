import { createClient } from "@supabase/supabase-js";
import type { ApiConfig } from "./types/api-config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get API configuration by provider
 */
export async function getApiConfig(provider: string): Promise<ApiConfig | null> {
  try {
    const { data, error } = await supabase
      .from("api_configs")
      .select("*")
      .eq("provider", provider)
      .eq("is_enabled", true)
      .single();

    if (error) {
      console.error(`[api-config] Error fetching ${provider} config:`, error);
      return null;
    }

    return data as ApiConfig;
  } catch (error) {
    console.error(`[api-config] Error:`, error);
    return null;
  }
}

/**
 * Get Intax API config with book_id
 */
export async function getIntaxConfig(): Promise<{ apiKey: string; bookId: number | null } | null> {
  const config = await getApiConfig("intax");
  if (!config) return null;
  
  return {
    apiKey: config.api_key,
    bookId: config.book_id,
  };
}

/**
 * Get all API configs (admin only)
 */
export async function getAllApiConfigs(): Promise<ApiConfig[]> {
  try {
    const { data, error } = await supabase
      .from("api_configs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api-config] Error fetching all configs:", error);
      return [];
    }

    return (data as ApiConfig[]) || [];
  } catch (error) {
    console.error("[api-config] Error:", error);
    return [];
  }
}

/**
 * Create or update API config
 */
export async function upsertApiConfig(config: Omit<ApiConfig, "id" | "created_at" | "updated_at">): Promise<ApiConfig | null> {
  try {
    const { data, error } = await supabase
      .from("api_configs")
      .upsert(config, { onConflict: "provider" })
      .select()
      .single();

    if (error) {
      console.error("[api-config] Error upserting config:", error);
      return null;
    }

    return data as ApiConfig;
  } catch (error) {
    console.error("[api-config] Error:", error);
    return null;
  }
}

/**
 * Delete API config
 */
export async function deleteApiConfig(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("api_configs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[api-config] Error deleting config:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[api-config] Error:", error);
    return false;
  }
}
