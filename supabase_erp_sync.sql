-- 1. Create the Queue Table
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

-- 2. Add Mapping Columns for Intax Integration
ALTER TABLE seasonal_plans ADD COLUMN IF NOT EXISTS intax_service_plan_price_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS intax_lead_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS intax_subscription_id INTEGER;

-- 3. Trigger for updated_at
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE erp_sync_queue ENABLE ROW LEVEL SECURITY;

-- 5. Service Role Policy (Allows the Next.js API to read/write)
DROP POLICY IF EXISTS "Service role can manage erp_sync_queue" ON erp_sync_queue;
CREATE POLICY "Service role can manage erp_sync_queue" 
ON erp_sync_queue FOR ALL USING (true) WITH CHECK (true);
