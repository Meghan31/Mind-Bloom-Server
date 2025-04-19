// scripts/migrateToSupabase.ts
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// Create Prisma client for Supabase
const prisma = new PrismaClient();

// Create a PostgreSQL pool for local database
const localPool = new Pool({
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
	} catch (error) {
		console.error('Migration failed:', error);
	} finally {
		await prisma.$disconnect();
		await localPool.end();
	}
}

migrateData();
