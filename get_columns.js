const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwdfuqknkpxokkcvopfz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGZ1cWtua3B4b2trY3ZvcGZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2Mzg0MywiZXhwIjoyMDgxNzM5ODQzfQ.zDBEF39Hhg1sTZYTW1KcFZo1MpreYyx-A89m2Br1hwI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'bookings' });
  if (error) {
    // If RPC doesn't exist, try a simple select and check keys
    const { data: b } = await supabase.from('bookings').select('*').limit(1);
    if (b && b.length > 0) {
        console.log('Columns:', Object.keys(b[0]));
    } else {
        console.log('Table empty or RPC missing');
    }
  } else {
    console.log('Columns:', data);
  }
}
run();
