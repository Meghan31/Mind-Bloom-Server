// import { PrismaClient } from '@prisma/client';

// // Create a singleton instance of PrismaClient
// const prismaClientSingleton = () => {
// 	return new PrismaClient({
// 		log:
// 			process.env.NODE_ENV === 'development'
// 				? ['query', 'error', 'warn']
// 				: ['error'],
// 	});
// };

// // Define the global variable type
// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// // Define globalThis interface extension
// declare global {
// 	var prisma: PrismaClientSingleton | undefined;
// }

// // Export the Prisma client instance
// export const prisma = globalThis.prisma ?? prismaClientSingleton();

// // In development, keep the instance alive between reloads
// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
	return new PrismaClient({
		log: [
			{ level: 'error', emit: 'event' },
			{ level: 'warn', emit: 'event' },
			{ level: 'info', emit: 'event' },
			{ level: 'query', emit: 'event' },
		],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});
};

// Define the global variable type
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Define globalThis interface extension
declare global {
	var prisma: PrismaClientSingleton | undefined;
}

// Export the Prisma client instance
export const prisma = globalThis.prisma ?? prismaClientSingleton();

// Add error logging
prisma.$on('error', (event) => {
	console.error('Prisma Error:', event);
});

prisma.$on('warn', (event) => {
	console.warn('Prisma Warning:', event);
});

// In development, keep the instance alive between reloads
if (process.env.NODE_ENV !== 'production') {
	globalThis.prisma = prisma;
}

// Optional: Add a connection test function
export async function testDatabaseConnection() {
	try {
		await prisma.$connect();
		console.log('Database connection successful');
		return true;
	} catch (error) {
		console.error('Database connection failed:', error);
		return false;
	} finally {
		await prisma.$disconnect();
	}
}
