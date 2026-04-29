/**
 * POST /api/erp/process-queue
 * 
 * Processes pending ERP sync items from the queue.
 * Call this from a cron job, admin panel, or manually.
 */

import { NextResponse } from 'next/server';
import { processQueue } from '@/lib/erp-sync';

export async function POST() {
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 });
    }

    const result = await processQueue(supabase);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('[erp/process-queue] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Also allow GET for easy browser/cron access
export async function GET() {
  return POST();
}
