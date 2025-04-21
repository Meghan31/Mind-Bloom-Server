"use strict";
// // src/lib/prisma.ts
// import { Prisma, PrismaClient } from '@prisma/client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
exports.disconnectPrisma = disconnectPrisma;
// // Define global type for PrismaClient instance
// declare global {
// 	// eslint-disable-next-line no-var
// 	var prisma: PrismaClient | undefined;
// }
// // Configure and instantiate Prisma client
// function createPrismaClient(): PrismaClient {
// 	// Set log levels based on environment
// 	const logLevels: Prisma.LogLevel[] =
// 		process.env.NODE_ENV === 'production'
// 			? ['error']
// 			: ['error', 'warn', 'info', 'query'];
// 	// Create a new Prisma client instance with appropriate configuration
// 	const client = new PrismaClient({
// 		log: logLevels,
// 		// This ensures we use the correct connection URL
// 		datasources: {
// 			db: {
// 				url: process.env.DATABASE_URL,
// 			},
// 		},
// 	});
// 	// Error handling and logging configuration
// 	if (process.env.NODE_ENV !== 'production') {
// 		// More verbose logging in development
// 		console.log(
// 			'Prisma Client initialized in development mode with extended logging'
// 		);
// 	}
// 	return client;
// }
// // Use singleton pattern to avoid multiple instances during hot reloads in development
// export const prisma = globalThis.prisma || createPrismaClient();
// // In development, preserve the client between hot reloads
// if (process.env.NODE_ENV !== 'production') {
// 	globalThis.prisma = prisma;
// }
// // Test database connection function
// export async function testDatabaseConnection(): Promise<boolean> {
// 	try {
// 		// Test the connection
// 		await prisma.$connect();
// 		// Execute a simple query to verify database access
// 		await prisma.$queryRaw`SELECT 1 as connection_test`;
// 		console.log('✅ Database connection successful');
// 		return true;
// 	} catch (error) {
// 		console.error('❌ Database connection failed:', error);
// 		// Provide more detailed error information based on error type
// 		if (error instanceof Prisma.PrismaClientInitializationError) {
// 			console.error(
// 				'Failed to initialize the Prisma client. Check your DATABASE_URL.'
// 			);
// 		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
// 			console.error(
// 				`Known request error: ${error.message} (Code: ${error.code})`
// 			);
// 		} else if (error instanceof Error) {
// 			console.error(`Error message: ${error.message}`);
// 		}
// 		return false;
// 	}
// }
// // Handle application shutdown
// export async function disconnectPrisma(): Promise<void> {
// 	try {
// 		await prisma.$disconnect();
// 		console.log('Prisma client disconnected successfully');
// 	} catch (error) {
// 		console.error('Error disconnecting Prisma client:', error);
// 		process.exit(1);
// 	}
// }
// src/lib/prisma.ts
const client_1 = require("@prisma/client");
// Create a simple PrismaClient instance
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
// Test database connection function
async function testDatabaseConnection() {
    try {
        // Test the connection
        await exports.prisma.$queryRaw `SELECT 1 as connection_test`;
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        if (error instanceof Error) {
            console.error(`Error message: ${error.message}`);
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
