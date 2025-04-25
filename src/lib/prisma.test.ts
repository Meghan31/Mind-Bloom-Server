// src/lib/prisma.test.ts
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { prisma, testDatabaseConnection } from './prisma';

// Mock the PrismaClient methods
vi.mock('@prisma/client', () => {
	const mockPrismaClient = {
		$queryRaw: vi.fn().mockResolvedValue([{ connection_test: 1 }]),
		$disconnect: vi.fn().mockResolvedValue(true),
		user: {
			findUnique: vi.fn().mockResolvedValue({
				id: 1,
				username: 'testuser',
				email: 'test@example.com',
				password_hash: 'hashed_password',
				created_at: new Date(),
				updated_at: new Date(),
			}),
			create: vi.fn().mockImplementation((data) =>
				Promise.resolve({
					id: 1,
					...data.data,
					created_at: new Date(),
					updated_at: new Date(),
				})
			),
			count: vi.fn().mockResolvedValue(5),
		},
		affirmation: {
			findFirst: vi.fn().mockResolvedValue({
				id: 1,
				content: 'Test affirmation content',
				mood_type: 'Happy',
				created_at: new Date(),
				updated_at: new Date(),
			}),
			findMany: vi.fn().mockResolvedValue([
				{
					id: 1,
					content: 'Test affirmation content',
					mood_type: 'Happy',
					created_at: new Date(),
					updated_at: new Date(),
				},
			]),
			create: vi.fn().mockImplementation((data) =>
				Promise.resolve({
					id: 1,
					...data.data,
					created_at: new Date(),
					updated_at: new Date(),
				})
			),
			count: vi.fn().mockResolvedValue(5),
		},
		journalEntry: {
			create: vi.fn().mockImplementation((data) =>
				Promise.resolve({
					id: 1,
					...data.data,
					created_at: new Date(),
					updated_at: new Date(),
				})
			),
			findMany: vi.fn().mockResolvedValue([
				{
					id: 1,
					user_id: 1,
					content: 'Test journal content',
					mood: 'Happy',
					affirmation_id: 1,
					entry_date: new Date(),
					created_at: new Date(),
					updated_at: new Date(),
					user: {
						id: 1,
						username: 'testuser',
						email: 'test@example.com',
					},
					affirmation: {
						id: 1,
						content: 'Test affirmation content',
						mood_type: 'Happy',
					},
				},
			]),
			findUnique: vi.fn().mockResolvedValue({
				id: 1,
				user_id: 1,
				content: 'Test journal content',
				mood: 'Happy',
				affirmation_id: 1,
				entry_date: new Date(),
				created_at: new Date(),
				updated_at: new Date(),
				user: {
					id: 1,
					username: 'testuser',
					email: 'test@example.com',
				},
				affirmation: {
					id: 1,
					content: 'Test affirmation content',
					mood_type: 'Happy',
				},
			}),
			count: vi.fn().mockResolvedValue(5),
		},
	};

	return {
		PrismaClient: vi.fn(() => mockPrismaClient),
	};
});

describe('Prisma database operations', () => {
	beforeAll(async () => {
		// No need to clear databases anymore since we're mocking
		console.log(
			'Initializing PrismaClient with DATABASE_URL:',
			process.env.DATABASE_URL
				? '***' + process.env.DATABASE_URL.split('@')[1]
				: 'undefined'
		);
	});

	afterAll(async () => {
		// Clean up and disconnect
		await prisma.$disconnect();
	});

	test('testDatabaseConnection returns true with mocked connection', async () => {
		const isConnected = await testDatabaseConnection();
		expect(isConnected).toBe(true);
	});

	test('creates a user and retrieves it', async () => {
		// Create a test user
		const testUser = await prisma.user.create({
			data: {
				username: 'testuser',
				email: 'test@example.com',
				password_hash: 'hashed_password',
			},
		});

		// Verify user was created with correct data
		expect(testUser.id).toBeDefined();
		expect(testUser.username).toBe('testuser');
		expect(testUser.email).toBe('test@example.com');

		// Retrieve the user
		const retrievedUser = await prisma.user.findUnique({
			where: { id: testUser.id },
		});

		// Verify retrieved user matches created user
		expect(retrievedUser).toBeDefined();
		expect(retrievedUser?.username).toBe(testUser.username);
		expect(retrievedUser?.email).toBe(testUser.email);
	});

	test('creates an affirmation and retrieves it', async () => {
		// Create a test affirmation
		const testAffirmation = await prisma.affirmation.create({
			data: {
				content: 'Test affirmation content',
				mood_type: 'Happy',
			},
		});

		// Verify affirmation was created with correct data
		expect(testAffirmation.id).toBeDefined();
		expect(testAffirmation.content).toBe('Test affirmation content');
		expect(testAffirmation.mood_type).toBe('Happy');

		// Retrieve the affirmation
		const retrievedAffirmation = await prisma.affirmation.findFirst({
			where: { id: testAffirmation.id },
		});

		// Verify retrieved affirmation matches created affirmation
		expect(retrievedAffirmation).toBeDefined();
		expect(retrievedAffirmation?.content).toBe(testAffirmation.content);
		expect(retrievedAffirmation?.mood_type).toBe(testAffirmation.mood_type);
	});

	test('creates a journal entry with a relationship to user and affirmation', async () => {
		// Create a test journal entry
		const testEntry = await prisma.journalEntry.create({
			data: {
				user_id: 1,
				content: 'Test journal content',
				mood: 'Happy',
				affirmation_id: 1,
				entry_date: new Date(),
			},
		});

		// Verify journal entry was created with correct data
		expect(testEntry.id).toBeDefined();
		expect(testEntry.user_id).toBe(1);
		expect(testEntry.content).toBe('Test journal content');
		expect(testEntry.mood).toBe('Happy');
		expect(testEntry.affirmation_id).toBe(1);

		// Retrieve the journal entry with relationships
		const retrievedEntry = await prisma.journalEntry.findUnique({
			where: { id: testEntry.id },
			include: {
				user: true,
				affirmation: true,
			},
		});

		// Verify retrieved entry has correct relationships
		expect(retrievedEntry).toBeDefined();
		expect(retrievedEntry?.user.username).toBe('testuser');
		expect(retrievedEntry?.affirmation?.content).toBe(
			'Test affirmation content'
		);
	});
});
