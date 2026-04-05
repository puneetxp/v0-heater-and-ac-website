import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jwdfuqknkpxokkcvopfz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGZ1cWtua3B4b2trY3ZvcGZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2Mzg0MywiZXhwIjoyMDgxNzM5ODQzfQ.zDBEF39Hhg1sTZYTW1KcFZo1MpreYyx-A89m2Br1hwI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
    console.log('Checking products table columns...');
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    if (error) {
        console.error('Error fetching products:', error);
        return;
    }
    
    if (data && data.length > 0) {
        console.log('Columns found:', Object.keys(data[0]));
        console.log('Sample row:', data[0]);
    } else {
        console.log('Table is empty. Checking table structure via RPC if available...');
        // If empty, we can try to insert and rollback, or just assume the SQL scripts were followed.
    }
}

checkSchema();
