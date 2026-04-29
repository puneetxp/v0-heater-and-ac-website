import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = `
CREATE TABLE IF NOT EXISTS erp_sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(255) NOT NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    error_message TEXT,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Also add the mapping columns we discussed
ALTER TABLE seasonal_plans ADD COLUMN IF NOT EXISTS intax_service_plan_price_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS intax_lead_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS intax_subscription_id INTEGER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_erp_sync_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_erp_sync_queue_updated_at ON erp_sync_queue;
CREATE TRIGGER update_erp_sync_queue_updated_at
    BEFORE UPDATE ON erp_sync_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_erp_sync_queue_updated_at();

-- Add RLS
ALTER TABLE erp_sync_queue ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Service role can manage erp_sync_queue" ON erp_sync_queue;
CREATE POLICY "Service role can manage erp_sync_queue" ON erp_sync_queue FOR ALL USING (true) WITH CHECK (true);
  `;
  
  // Try to use a custom rpc function to execute arbitrary SQL if it exists
  const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
  if (error) {
    console.log("RPC Error (Might not have exec_sql):", error);
  } else {
    console.log("Success:", data);
  }
}

run();
