const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwdfuqknkpxokkcvopfz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGZ1cWtua3B4b2trY3ZvcGZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2Mzg0MywiZXhwIjoyMDgxNzM5ODQzfQ.zDBEF39Hhg1sTZYTW1KcFZo1MpreYyx-A89m2Br1hwI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = "CREATE TABLE IF NOT EXISTS booking_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE, product_id BIGINT REFERENCES products(id), seasonal_plan_id BIGINT REFERENCES seasonal_plans(id), quantity INTEGER NOT NULL DEFAULT 1, unit_price DECIMAL(10, 2) NOT NULL, subtotal DECIMAL(10, 2) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()); ALTER TABLE bookings ALTER COLUMN product_id DROP NOT NULL;";
  
  // Note: exec_sql RPC must exist on Supabase. If not, this will fail.
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.log('Migration via RPC failed:', error.message);
    console.log('Note: This feature requires a custom PostgreSQL function "exec_sql" to be defined in your Supabase project.');
  } else {
    console.log('Migration successful');
  }
}
run();
