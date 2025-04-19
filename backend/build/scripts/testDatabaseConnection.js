"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/scripts/testDatabaseConnection.ts
const client_1 = require("@prisma/client");
require("dotenv/config");
async function testConnection() {
    console.log('Database URL:', process.env.DATABASE_URL);
    console.log('Direct URL:', process.env.DIRECT_URL);
    const prisma = new client_1.PrismaClient({
        log: ['error', 'warn'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
    try {
        console.log('Attempting to connect...');
        await prisma.$connect();
        console.log('✅ Successfully connected to the database!');
        // Perform a simple query to verify
        const userCount = await prisma.user.count();
        console.log(`Total users in the database: ${userCount}`);
    }
    catch (error) {
        console.error('❌ Connection failed:', error);
        // Additional network diagnostics
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}
testConnection();
