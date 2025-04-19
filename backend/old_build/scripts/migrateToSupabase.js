"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/migrateToSupabase.ts
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
const pg_1 = require("pg");
// Load environment variables
dotenv.config();
// Create Prisma client for Supabase
const prisma = new client_1.PrismaClient();
// Create a PostgreSQL pool for local database
const localPool = new pg_1.Pool({
    connectionString: process.env.LOCAL_DATABASE_URL,
});
async function migrateData() {
    console.log('Starting migration to Supabase...');
    try {
        // Step 1: Migrate users
        console.log('Migrating users...');
        const users = await localPool.query('SELECT * FROM users');
        for (const user of users.rows) {
            await prisma.user.upsert({
                where: { id: user.id },
                update: {
                    username: user.username,
                    email: user.email,
                    password_hash: user.password_hash,
                    created_at: user.created_at,
                    updated_at: user.updated_at || user.created_at,
                },
                create: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password_hash: user.password_hash,
                    created_at: user.created_at,
                    updated_at: user.updated_at || user.created_at,
                },
            });
        }
        console.log(`Migrated ${users.rows.length} users`);
        // Step 2: Migrate affirmations
        console.log('Migrating affirmations...');
        const affirmations = await localPool.query('SELECT * FROM affirmations');
        for (const affirmation of affirmations.rows) {
            await prisma.affirmation.upsert({
                where: { id: affirmation.id },
                update: {
                    content: affirmation.content,
                    mood_type: affirmation.mood_type,
                    created_at: affirmation.created_at,
                    updated_at: affirmation.updated_at || affirmation.created_at,
                },
                create: {
                    id: affirmation.id,
                    content: affirmation.content,
                    mood_type: affirmation.mood_type,
                    created_at: affirmation.created_at,
                    updated_at: affirmation.updated_at || affirmation.created_at,
                },
            });
        }
        console.log(`Migrated ${affirmations.rows.length} affirmations`);
        // Step 3: Migrate journal entries
        console.log('Migrating journal entries...');
        const entries = await localPool.query('SELECT * FROM journal_entries');
        for (const entry of entries.rows) {
            await prisma.journalEntry.upsert({
                where: { id: entry.id },
                update: {
                    user_id: entry.user_id,
                    content: entry.content,
                    mood: entry.mood,
                    affirmation_id: entry.affirmation_id,
                    entry_date: entry.entry_date,
                    created_at: entry.created_at,
                    updated_at: entry.updated_at || entry.created_at,
                },
                create: {
                    id: entry.id,
                    user_id: entry.user_id,
                    content: entry.content,
                    mood: entry.mood,
                    affirmation_id: entry.affirmation_id,
                    entry_date: entry.entry_date,
                    created_at: entry.created_at,
                    updated_at: entry.updated_at || entry.created_at,
                },
            });
        }
        console.log(`Migrated ${entries.rows.length} journal entries`);
        console.log('Migration completed successfully!');
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await prisma.$disconnect();
        await localPool.end();
    }
}
migrateData();
