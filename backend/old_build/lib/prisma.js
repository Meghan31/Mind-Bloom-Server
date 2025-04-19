"use strict";
// import { PrismaClient } from '@prisma/client';
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// // Create a singleton instance of PrismaClient
// const prismaClientSingleton = () => {
// 	const connectionString = process.env.DIRECT_URL;
// 	return new PrismaClient({
// 		datasources: {
// 			db: {
// 				url: connectionString,
// 			},
// 		},
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
// // In development, we want to keep the instance alive between reloads
// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
var client_1 = require("@prisma/client");
// Create a singleton instance of PrismaClient
var prismaClientSingleton = function () {
    return new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
};
// Export the Prisma client instance
exports.prisma = (_a = globalThis.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
// In development, keep the instance alive between reloads
if (process.env.NODE_ENV !== 'production')
    globalThis.prisma = exports.prisma;
