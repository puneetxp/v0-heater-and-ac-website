/**
 * ERP Sync Engine
 * 
 * Handles syncing bookings to the Intax ERP with a retry queue.
 * - Lead is created immediately on checkout.
 * - Subscription is created when booking status changes to "subscribed".
 * - If ERP is unreachable, the sync is queued and retried later.
 */

import { intaxCreate } from '@/lib/intax/client';
import type { ApiLead } from '@/lib/intax/types';

export type SyncAction = 'create_lead' | 'create_subscription';

export interface SyncPayload {
  action: SyncAction;
  booking_id: string;
  data: Record<string, any>;
}

/**
 * Attempt to sync with the ERP. If it fails, queue for retry.
 */
export async function syncToERP(
  supabase: any,
  payload: SyncPayload
): Promise<{ success: boolean; result?: any; queued?: boolean }> {
  try {
    let result: any = null;

    if (payload.action === 'create_lead') {
      result = await intaxCreate<ApiLead>('lead', payload.data as any);

      // If lead was created successfully, store the intax_lead_id on the booking
      if (result?.id) {
        await supabase
          .from('bookings')
          .update({ intax_lead_id: result.id })
          .eq('id', payload.booking_id);
      }
    }

    if (payload.action === 'create_subscription') {
      result = await intaxCreate('subscription' as any, payload.data as any);

      // If subscription created, store the id
      if (result?.id) {
        await supabase
          .from('bookings')
          .update({ intax_subscription_id: result.id })
          .eq('id', payload.booking_id);
      }
    }

    return { success: true, result };
  } catch (error: any) {
    console.error(`[erp-sync] Failed to ${payload.action}:`, error.message);

    // Queue for retry
    await queueSync(supabase, payload, error.message);

    return { success: false, queued: true };
  }
}

/**
 * Queue a failed sync for later retry.
 */
async function queueSync(
  supabase: any,
  payload: SyncPayload,
  errorMessage: string
) {
  try {
    await supabase.from('erp_sync_queue').insert({
      action: payload.action,
      booking_id: payload.booking_id,
      payload: payload.data,
      error_message: errorMessage,
      status: 'pending',
      attempts: 1,
      next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 min
    });
    console.log(`[erp-sync] Queued ${payload.action} for booking ${payload.booking_id}`);
  } catch (queueError) {
    console.error('[erp-sync] CRITICAL: Failed to queue sync:', queueError);
  }
}

/**
 * Process all pending items from the queue.
 * Call this from a cron or admin endpoint.
 */
export async function processQueue(supabase: any): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> {
  const { data: pendingItems, error } = await supabase
    .from('erp_sync_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('next_retry_at', new Date().toISOString())
    .order('created_at', { ascending: true })
    .limit(20);

  if (error || !pendingItems?.length) {
    return { processed: 0, succeeded: 0, failed: 0 };
  }

  let succeeded = 0;
  let failed = 0;

  for (const item of pendingItems) {
    const payload: SyncPayload = {
      action: item.action,
      booking_id: item.booking_id,
      data: item.payload,
    };

    try {
      let result: any = null;

      if (payload.action === 'create_lead') {
        result = await intaxCreate<ApiLead>('lead', payload.data as any);
        if (result?.id) {
          await supabase
            .from('bookings')
            .update({ intax_lead_id: result.id })
            .eq('id', payload.booking_id);
        }
      }

      if (payload.action === 'create_subscription') {
        result = await intaxCreate('subscription' as any, payload.data as any);
        if (result?.id) {
          await supabase
            .from('bookings')
            .update({ intax_subscription_id: result.id })
            .eq('id', payload.booking_id);
        }
      }

      // Mark as done
      await supabase
        .from('erp_sync_queue')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', item.id);

      succeeded++;
    } catch (retryError: any) {
      const attempts = (item.attempts || 0) + 1;
      const maxAttempts = 3; // Initial try + 2 retries

      if (attempts >= maxAttempts) {
        // Give up after 2 retries, require manual intervention
        await supabase
          .from('erp_sync_queue')
          .update({
            status: 'failed',
            attempts,
            error_message: retryError.message,
          })
          .eq('id', item.id);
      } else {
        // Exponential backoff: 5min, 15min, 45min, 2hr
        const backoffMs = 5 * 60 * 1000 * Math.pow(3, attempts - 1);
        await supabase
          .from('erp_sync_queue')
          .update({
            attempts,
            error_message: retryError.message,
            next_retry_at: new Date(Date.now() + backoffMs).toISOString(),
          })
          .eq('id', item.id);
      }

      failed++;
    }
  }

  return { processed: pendingItems.length, succeeded, failed };
}

/**
 * Build Lead data from booking info
 */
export function buildLeadPayload(customer: {
  name: string;
  email: string;
  phone: string;
}, address: {
  address: string;
  city: string;
  state: string;
  pincode: string;
}, items: Array<{
  product_name: string;
  plan_name?: string;
  quantity: number;
  unit_price: number;
}>, totals: {
  subtotal: number;
  gst: number;
  total: number;
  totalDeposit: number;
}) {
  const itemSummary = items
    .map(i => `${i.quantity}x ${i.product_name}${i.plan_name ? ` (${i.plan_name})` : ''} @ ₹${i.unit_price}`)
    .join(', ');

  return {
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    status: 'new',
    source: 'website',
    priority: 'high',
    notes: `Website Booking | ${itemSummary} | Total: ₹${totals.total} | Address: ${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
  };
}

/**
 * Build Subscription data from a booking item
 */
export function buildSubscriptionPayload(
  durationDays: number,
  servicePlanPriceId: number,
) {
  return {
    day: durationDays,
    service_plan_price_id: servicePlanPriceId,
  };
}
