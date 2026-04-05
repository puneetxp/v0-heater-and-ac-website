import pkg from 'pg';
const { Client } = pkg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = 'postgres://postgres.jwdfuqknkpxokkcvopfz:HDCEtrqQEigJgPZb@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require';

async function query() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT DISTINCT category FROM products");
        console.log("Categories in DB:", res.rows);
    } catch (err) {
        console.error('Query failed:', err);
    } finally {
        await client.end();
    }
}

query();
