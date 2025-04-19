"use strict";
// import { PrismaClient } from '@prisma/client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
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
var client_1 = require("@prisma/client");
// Create a singleton instance of PrismaClient
var prismaClientSingleton = function () {
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
exports.prisma = (_a = globalThis.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
// Add error logging
exports.prisma.$on('error', function (event) {
    console.error('Prisma Error:', event);
});
exports.prisma.$on('warn', function (event) {
    console.warn('Prisma Warning:', event);
});
// In development, keep the instance alive between reloads
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = exports.prisma;
}
// Optional: Add a connection test function
function testDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 5]);
                    return [4 /*yield*/, exports.prisma.$connect()];
                case 1:
                    _a.sent();
                    console.log('Database connection successful');
                    return [2 /*return*/, true];
                case 2:
                    error_1 = _a.sent();
                    console.error('Database connection failed:', error_1);
                    return [2 /*return*/, false];
                case 3: return [4 /*yield*/, exports.prisma.$disconnect()];
                case 4:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
