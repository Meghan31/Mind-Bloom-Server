// scripts/checkStatus.ts
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Prisma client
const prisma = new PrismaClient();

async function checkStatus() {
	console.log('Checking Supabase & Prisma setup status...');

	try {
		// Check database connection
		console.log('Testing database connection...');
		await prisma.$queryRaw`SELECT 1 as connection_test`;
		console.log('✅ Database connection successful');

		// Check tables
		console.log('\nChecking database tables...');

		// Users table
		const userCount = await prisma.user.count();
		console.log(`✅ Users table exists with ${userCount} records`);

		// Affirmations table
		const affirmationCount = await prisma.affirmation.count();
		console.log(
			`✅ Affirmations table exists with ${affirmationCount} records`
		);

		// Journal entries table
		const entryCount = await prisma.journalEntry.count();
		console.log(`✅ Journal entries table exists with ${entryCount} records`);

		// Get a sample of each table
		if (userCount > 0) {
			const sampleUser = await prisma.user.findFirst({
				select: {
					id: true,
					username: true,
					email: true,
					created_at: true,
				},
			});
			console.log('\nSample user:', sampleUser);
		}

		if (affirmationCount > 0) {
			const sampleAffirmation = await prisma.affirmation.findFirst({
				select: {
					id: true,
					content: true,
					mood_type: true,
				},
			});
			console.log('\nSample affirmation:', sampleAffirmation);
		}

		if (entryCount > 0) {
			const sampleEntry = await prisma.journalEntry.findFirst({
				select: {
					id: true,
					user_id: true,
					content: true,
					mood: true,
					entry_date: true,
				},
			});
			console.log('\nSample journal entry:', sampleEntry);
		}

		console.log(
			'\n✅ All checks passed. Your Supabase database with Prisma is set up correctly!'
		);
	} catch (error) {
		console.error('\n❌ Error checking status:', error);
		console.log('\nSuggestions:');
		console.log('1. Check your DATABASE_URL in .env file');
		console.log('2. Make sure your Supabase project is running');
		console.log('3. Verify that the database user has appropriate permissions');
		console.log(
			'4. Run "npx prisma db push" to create the schema if it doesn\'t exist'
		);
	} finally {
		await prisma.$disconnect();
	}
}

checkStatus();
