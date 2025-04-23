"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
exports.disconnectPrisma = disconnectPrisma;
// src/lib/prisma.ts
const client_1 = require("@prisma/client");
// Function to create a new PrismaClient instance
function createPrismaClient() {
    // Log connection URL (but mask sensitive parts for security)
    const dbUrl = process.env.DATABASE_URL || '';
    const maskedUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`Initializing PrismaClient with DATABASE_URL: ${maskedUrl}`);
    return new client_1.PrismaClient({
        log: ['error', 'warn'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
}
// Use existing client instance if available, or create a new one
exports.prisma = globalThis.prisma || createPrismaClient();
// Save the client instance in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = exports.prisma;
}
// Test database connection function
async function testDatabaseConnection() {
    try {
        console.log('Testing database connection...');
        // Execute a simple query to verify database access
        await exports.prisma.$queryRaw `SELECT 1 as connection_test`;
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        // Provide more detailed error information
        if (error instanceof Error) {
            console.error(`Error message: ${error.message}`);
            console.error('Please check your DATABASE_URL and DIRECT_URL environment variables');
            // Log schema.prisma configuration
            try {
                const fs = require('fs');
                const path = require('path');
                const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
                if (fs.existsSync(schemaPath)) {
                    const schema = fs.readFileSync(schemaPath, 'utf8');
                    console.log('Current schema.prisma configuration:');
                    console.log(schema);
                }
            }
            catch (fsError) {
                console.error('Error reading schema.prisma:', fsError);
            }
        }
        return false;
    }
}
// Handle application shutdown
async function disconnectPrisma() {
    try {
        await exports.prisma.$disconnect();
        console.log('Prisma client disconnected successfully');
    }
    catch (error) {
        console.error('Error disconnecting Prisma client:', error);
    }
}
