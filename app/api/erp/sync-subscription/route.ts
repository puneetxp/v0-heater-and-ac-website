/**
 * POST /api/erp/sync-subscription
 * 
 * Called when a booking's status changes to "subscribed".
 * Creates Subscription records in the Intax ERP for each booking item 
 * that has a mapped intax_service_plan_price_id.
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncToERP, buildSubscriptionPayload } from '@/lib/erp-sync';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json({ error: 'Missing booking_id' }, { status: 400 });
    }

    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 });
    }

    // Fetch booking items with their seasonal plan data
    const { data: bookingItems, error: itemsError } = await supabase
      .from('booking_items')
      .select(`
        id,
        product_id,
        seasonal_plan_id,
        quantity,
        unit_price,
        subtotal,
        seasonal_plans:seasonal_plan_id (
          id,
          name,
          duration_months,
          intax_service_plan_price_id
        )
      `)
      .eq('booking_id', booking_id);

    if (itemsError) {
      console.error('[erp/sync-subscription] Failed to fetch booking items:', itemsError);
      return NextResponse.json({ error: 'Failed to fetch booking items' }, { status: 500 });
    }

    if (!bookingItems?.length) {
      return NextResponse.json({ success: true, message: 'No booking items found', subscriptions_created: 0 });
    }

    const results: Array<{ item_id: string; success: boolean; queued?: boolean }> = [];

    for (const item of bookingItems) {
      const plan = item.seasonal_plans as any;
      
      // Skip items without Intax mapping
      if (!plan?.intax_service_plan_price_id) {
        console.log(`[erp/sync-subscription] Skipping item ${item.id} — no intax_service_plan_price_id`);
        continue;
      }

      const durationDays = (plan.duration_months || 1) * 30;
      const subscriptionData = buildSubscriptionPayload(durationDays, plan.intax_service_plan_price_id);

      const result = await syncToERP(supabase, {
        action: 'create_subscription',
        booking_id,
        data: subscriptionData,
      });

      results.push({
        item_id: item.id,
        success: result.success,
        queued: result.queued,
      });
    }

    // Update booking status to reflect sync
    await supabase
      .from('bookings')
      .update({ status: 'subscribed' })
      .eq('id', booking_id);

    return NextResponse.json({
      success: true,
      subscriptions_created: results.filter(r => r.success).length,
      queued: results.filter(r => r.queued).length,
      results,
    });
  } catch (error: any) {
    console.error('[erp/sync-subscription] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
