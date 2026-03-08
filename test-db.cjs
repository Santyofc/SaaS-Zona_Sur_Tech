const postgres = require('./packages/db/node_modules/postgres');

// Test 1: Direct DB connection (IPv6 only, need to verify if Node.js can resolve)
const url = 'postgresql://postgres:Santidevs2212%3F@db.rmkkrunxloleranvshto.supabase.co:5432/postgres';
const sql = postgres(url, { connect_timeout: 10, ssl: 'require' });

sql`SELECT id, email, password_hash FROM users LIMIT 3`
    .then(rows => {
        console.log('OK - rows:', rows.length);
        console.log(JSON.stringify(rows, null, 2));
        return sql.end();
    })
    .catch(err => {
        console.error('FAIL:', err.message);
        console.error('Code:', err.code);
        console.error('Detail:', err.detail);
        return sql.end();
    });
