"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/postgresTest.ts
require("dotenv/config");
const pg_1 = require("pg");
async function testPostgresConnection() {
    const connectionString = process.env.DIRECT_URL;
    if (!connectionString) {
        console.error('DIRECT_URL is not set in .env');
        return;
    }
    const client = new pg_1.Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false, // Use with caution, only for debugging
            // Alternatively, you can provide specific SSL options
            // ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
        },
        // Explicitly set authentication parameters
        // Uncomment and adjust if needed
        // user: 'your_username',
        // password: 'your_password',
    });
    try {
        console.log('Attempting to connect to PostgreSQL...');
        console.log('Connection String:', connectionString.replace(/:[^:]*@/, ':****@'));
        await client.connect();
        console.log('✅ Successfully connected to PostgreSQL!');
        // Detailed connection information
        console.log('\n🔍 Connection Details:');
        console.log('Host:', client.host);
        console.log('Port:', client.port);
        console.log('Database:', client.database);
        console.log('User:', client.user);
        // Simple query
        const result = await client.query('SELECT NOW()');
        console.log('\n🕒 Current database time:', result.rows[0].now);
        // Test table exists query
        try {
            const tableQuery = await client.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')");
            console.log('\n📊 Users table exists:', tableQuery.rows[0].exists);
        }
        catch (tableError) {
            console.error('Error checking users table:', tableError);
        }
    }
    catch (error) {
        console.error('❌ PostgreSQL Connection Failed:', error);
        // Provide more detailed error diagnosis
        if (error instanceof Error) {
            console.error('\n🔬 Detailed Error:');
            console.error('Error Name:', error.name);
            console.error('Error Message:', error.message);
            // Additional context for common connection issues
            if (error.message.includes('SASL')) {
                console.error('\n💡 Possible Causes:');
                console.error('- Incorrect authentication credentials');
                console.error('- SSL/TLS configuration mismatch');
                console.error('- Network security settings');
            }
        }
    }
    finally {
        await client.end();
    }
}
testPostgresConnection();
