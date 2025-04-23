// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Create a global variable to store a single instance of PrismaClient
declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

// Function to create a new PrismaClient instance
function createPrismaClient(): PrismaClient {
	// Log connection URL (but mask sensitive parts for security)
	const dbUrl = process.env.DATABASE_URL || '';
	const maskedUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
	console.log(`Initializing PrismaClient with DATABASE_URL: ${maskedUrl}`);

	return new PrismaClient({
		log: ['error', 'warn'],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});
}

// Use existing client instance if available, or create a new one
export const prisma = globalThis.prisma || createPrismaClient();

// Save the client instance in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
	globalThis.prisma = prisma;
}

// Test database connection function
export async function testDatabaseConnection(): Promise<boolean> {
	try {
		console.log('Testing database connection...');

		// Execute a simple query to verify database access
		await prisma.$queryRaw`SELECT 1 as connection_test`;

		console.log('✅ Database connection successful');
		return true;
	} catch (error) {
		console.error('❌ Database connection failed:', error);

		// Provide more detailed error information
		if (error instanceof Error) {
			console.error(`Error message: ${error.message}`);
			console.error(
				'Please check your DATABASE_URL and DIRECT_URL environment variables'
			);

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
			} catch (fsError) {
				console.error('Error reading schema.prisma:', fsError);
			}
		}

		return false;
	}
}

// Handle application shutdown
export async function disconnectPrisma(): Promise<void> {
	try {
		await prisma.$disconnect();
		console.log('Prisma client disconnected successfully');
	} catch (error) {
		console.error('Error disconnecting Prisma client:', error);
	}
}
