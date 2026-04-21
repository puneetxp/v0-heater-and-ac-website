/**
 * Intax API Client
 * Handles all requests to the intax backend API
 */

import type { APIBaseModel, ModelNames } from './types';

// INTAX_API should contain the full base URL (e.g., https://intax.in/api)
const INTAX_BASE_URL = process.env.INTAX_API || 'https://intax.in/api';
const INTAX_API_KEY = process.env.INTAX_API || '';

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

  // Validate API key
  if (!INTAX_API_KEY) {
    console.error('[intax] INTAX_API environment variable is not set');
    return null;
  }

  const url = `${INTAX_BASE_URL}${endpoint}`;

  try {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Accept': 'application/json',
      'Authorization': `Bearer ${INTAX_API_KEY}`,
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
  const endpoint = bookId 
    ? `/islogin/book/${bookId}/${model}` 
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
  const endpoint = bookId 
    ? `/islogin/book/${bookId}/${model}/${id}` 
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
  const endpoint = bookId 
    ? `/islogin/book/${bookId}/${model}` 
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
  const endpoint = bookId 
    ? `/islogin/book/${bookId}/${model}/${id}` 
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
  const endpoint = bookId 
    ? `/islogin/book/${bookId}/${model}/${id}` 
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
  const endpoint = bookId 
    ? `/islogin/book/${bookId}/${model}/where` 
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
