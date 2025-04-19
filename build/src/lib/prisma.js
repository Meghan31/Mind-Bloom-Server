"use strict";
// import { PrismaClient } from '@prisma/client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
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
const client_1 = require("@prisma/client");
// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
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
// Export the Prisma client instance
exports.prisma = globalThis.prisma ?? prismaClientSingleton();
// Add error logging
exports.prisma.$on('error', (event) => {
    console.error('Prisma Error:', event);
});
exports.prisma.$on('warn', (event) => {
    console.warn('Prisma Warning:', event);
});
// In development, keep the instance alive between reloads
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = exports.prisma;
}
// Optional: Add a connection test function
async function testDatabaseConnection() {
    try {
        await exports.prisma.$connect();
        console.log('Database connection successful');
        return true;
    }
    catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
    finally {
        await exports.prisma.$disconnect();
    }
}
