import pkg from 'pg';
const { Client } = pkg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = 'postgres://postgres.jwdfuqknkpxokkcvopfz:HDCEtrqQEigJgPZb@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require';

async function migrate() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL.');

        console.log('Adding is_available column to products table...');
        await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;');
        
        console.log('Syncing is_available from is_active...');
        await client.query('UPDATE products SET is_available = is_active;');
        
        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
