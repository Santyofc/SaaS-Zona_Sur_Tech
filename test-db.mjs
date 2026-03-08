// Standalone DB connection test
// Run with: node /tmp/test-db.mjs

const DATABASE_URL = "postgresql://postgres.rmkkrunxloleranvshto:Santidevs2212%3F@aws-0-us-east-1.pooler.supabase.com:5432/postgres";

async function main() {
    console.log("Testing connection to:", DATABASE_URL.replace(/:([^@]+)@/, ":***@"));

    try {
        const { default: postgres } = await import("postgres");
        const sql = postgres(DATABASE_URL, { connect_timeout: 10 });

        const result = await sql`SELECT id, email, password_hash FROM users LIMIT 3`;
        console.log("✅ Query success, rows:", result.length);
        console.log(result);

        await sql.end();
    } catch (err) {
        console.error("❌ Error:", err.message);
        console.error("Code:", err.code);
        process.exit(1);
    }
}

main();
