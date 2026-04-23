/**
 * Intax API Client
 * Handles all requests to the intax backend API
 */

import type { APIBaseModel, ModelNames } from './types';
import type { ApiConfig } from '@/lib/types/api-config';

// Cache for API config to avoid repeated database queries
let cachedApiConfig: ApiConfig | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// INTAX_API should contain the full base URL (e.g., https://intax.in/api)
const INTAX_BASE_URL = process.env.INTAX_API || 'https://intax.in/api';

export interface IntaxRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

interface IntaxErrorResponse {
  error?: string;
  message?: string;
  status?: number;
}

/**
 * Get active Intax API config from database
 */
async function getIntaxConfig(): Promise<ApiConfig | null> {
  // Check cache first
  if (cachedApiConfig && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedApiConfig;
  }

  try {
    // Fetch from local API endpoint that retrieves from database
    const response = await fetch('/api/admin/api-configs?provider=intax&enabled=true');
    
    if (!response.ok) {
      console.error('[intax] Failed to fetch API config:', response.status);
      return null;
    }

    const configs = await response.json() as ApiConfig[];
    
    if (configs && configs.length > 0) {
      cachedApiConfig = configs[0];
      cacheTime = Date.now();
      return cachedApiConfig;
    }

    return null;
  } catch (error) {
    console.error('[intax] Error fetching API config:', error);
    return null;
  }
}

/**
 * Make a request to the Intax API
 */
export async function intaxRequest<T extends APIBaseModel>(
  endpoint: string,
  options: IntaxRequestOptions = {},
): Promise<T | T[] | null> {
  const {
    method = 'GET',
    body,
    headers = {},
  } = options;

  // Get API config from database (includes API key and book_id)
  const config = await getIntaxConfig();
  
  if (!config || !config.api_key) {
    console.error('[intax] No active Intax API config found. Please configure in API Settings.');
    return null;
  }

  const apiKey = config.api_key;

  const url = `${INTAX_BASE_URL}${endpoint}`;

  try {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
      // Send body as stringified JSON
      fetchOptions.body = JSON.stringify(body);
    }

    console.log(`[intax] ${method} ${url}`);
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as IntaxErrorResponse;
      console.error(`[intax] Error: ${response.status} - ${errorData.message || errorData.error || 'Unknown error'}`);
      throw new Error(`Intax API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json() as T | T[];
    console.log(`[intax] Success: ${method} ${endpoint}`);
    return data;
  } catch (error) {
    console.error('[intax] Request failed:', error);
    throw error;
  }
}

/**
 * Generic GET all records for a book
 */
export async function intaxGetAll<T extends APIBaseModel>(
  model: ModelNames,
  bookId?: number,
): Promise<T[]> {
  // Use provided bookId or fetch from config
  let finalBookId = bookId;
  if (!finalBookId) {
    const config = await getIntaxConfig();
    finalBookId = config?.book_id;
  }

  const endpoint = finalBookId 
    ? `/islogin/book/${finalBookId}/${model}` 
    : `/islogin/${model}`;
  const result = await intaxRequest<T>(endpoint, { method: 'GET' });
  return Array.isArray(result) ? result : [];
}

/**
 * Generic GET single record
 */
export async function intaxGetById<T extends APIBaseModel>(
  model: ModelNames,
  id: number,
  bookId?: number,
): Promise<T | null> {
  let finalBookId = bookId;
  if (!finalBookId) {
    const config = await getIntaxConfig();
    finalBookId = config?.book_id;
  }

  const endpoint = finalBookId 
    ? `/islogin/book/${finalBookId}/${model}/${id}` 
    : `/islogin/${model}/${id}`;
  const result = await intaxRequest<T>(endpoint, { method: 'GET' });
  return Array.isArray(result) ? null : result || null;
}

/**
 * Generic CREATE record
 */
export async function intaxCreate<T extends APIBaseModel>(
  model: ModelNames,
  data: Omit<T, keyof APIBaseModel>,
  bookId?: number,
): Promise<T | null> {
  let finalBookId = bookId;
  if (!finalBookId) {
    const config = await getIntaxConfig();
    finalBookId = config?.book_id;
  }

  const endpoint = finalBookId 
    ? `/islogin/book/${finalBookId}/${model}` 
    : `/islogin/${model}`;
  const result = await intaxRequest<T>(endpoint, {
    method: 'POST',
    body: data,
  });
  return Array.isArray(result) ? null : result || null;
}

/**
 * Generic UPDATE record
 */
export async function intaxUpdate<T extends APIBaseModel>(
  model: ModelNames,
  id: number,
  data: Partial<Omit<T, keyof APIBaseModel>>,
  bookId?: number,
): Promise<T | null> {
  let finalBookId = bookId;
  if (!finalBookId) {
    const config = await getIntaxConfig();
    finalBookId = config?.book_id;
  }

  const endpoint = finalBookId 
    ? `/islogin/book/${finalBookId}/${model}/${id}` 
    : `/islogin/${model}/${id}`;
  const result = await intaxRequest<T>(endpoint, {
    method: 'PATCH',
    body: data,
  });
  return Array.isArray(result) ? null : result || null;
}

/**
 * Generic DELETE record (soft delete)
 */
export async function intaxDelete<T extends APIBaseModel>(
  model: ModelNames,
  id: number,
  bookId?: number,
): Promise<T | null> {
  let finalBookId = bookId;
  if (!finalBookId) {
    const config = await getIntaxConfig();
    finalBookId = config?.book_id;
  }

  const endpoint = finalBookId 
    ? `/islogin/book/${finalBookId}/${model}/${id}` 
    : `/islogin/${model}/${id}`;
  const result = await intaxRequest<T>(endpoint, { method: 'DELETE' });
  return Array.isArray(result) ? null : result || null;
}

/**
 * Generic WHERE/FILTER records
 */
export async function intaxWhere<T extends APIBaseModel>(
  model: ModelNames,
  filters: Record<string, any>,
  bookId?: number,
): Promise<T[]> {
  let finalBookId = bookId;
  if (!finalBookId) {
    const config = await getIntaxConfig();
    finalBookId = config?.book_id;
  }

  const endpoint = finalBookId 
    ? `/islogin/book/${finalBookId}/${model}/where` 
    : `/islogin/${model}/where`;
  const result = await intaxRequest<T>(endpoint, {
    method: 'POST',
    body: filters,
  });
  return Array.isArray(result) ? result : [];
}

/**
 * Check if API is configured
 */
export function isIntaxConfigured(): boolean {
  return !!INTAX_API_KEY;
}
