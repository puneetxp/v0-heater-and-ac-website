/**
 * POST /api/erp/sync-booking
 * 
 * Called after a successful checkout to push a Lead to the Intax ERP.
 * If the ERP is unreachable, the sync is queued for retry.
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncToERP, buildLeadPayload } from '@/lib/erp-sync';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking_id, customer, address, items, totals } = body;

    if (!booking_id || !customer) {
      return NextResponse.json({ error: 'Missing booking_id or customer' }, { status: 400 });
    }

    // Create admin Supabase client for storing sync results
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 });
    }

    // Build the lead payload
    const leadData = buildLeadPayload(customer, address, items || [], totals || {});

    // Sync to ERP (with automatic queue on failure)
    const result = await syncToERP(supabase, {
      action: 'create_lead',
      booking_id,
      data: leadData,
    });

    return NextResponse.json({
      success: result.success,
      queued: result.queued || false,
      lead_id: result.result?.id || null,
    });
  } catch (error: any) {
    console.error('[erp/sync-booking] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
