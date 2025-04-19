// // import { Express } from 'express';
// // import jwt from 'jsonwebtoken';
// // import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
// // import { prisma } from '../../lib/prisma';
// // import { appServer, AppServer } from '../../webSupport/appServer';
// // import { registerAffirmationRoutes } from '.././affirmationRoutes';

// // // Mock prisma
// // vi.mock('../lib/prisma', () => ({
// // 	prisma: {
// // 		affirmation: {
// // 			findMany: vi.fn(),
// // 			findFirst: vi.fn(),
// // 		},
// // 	},
// // }));

// // // Mock JWT verification
// // vi.mock('jsonwebtoken', () => ({
// // 	verify: vi
// // 		.fn()
// // 		.mockReturnValue({
// // 			userId: 1,
// // 			username: 'testuser',
// // 			email: 'test@example.com',
// // 		}),
// // }));

// // // Sample data for tests
// // const sampleAffirmations = [
// // 	{
// // 		id: 1,
// // 		content: 'Your positive energy is contagious. Keep shining your light!',
// // 		mood_type: 'Happy',
// // 		created_at: new Date(),
// // 		updated_at: new Date(),
// // 	},
// // 	{
// // 		id: 2,
// // 		content: 'Every moment of calm is a gift you give yourself.',
// // 		mood_type: 'Calm',
// // 		created_at: new Date(),
// // 		updated_at: new Date(),
// // 	},
// // ];

// // describe('affirmationRoutes', () => {
// // 	let server: AppServer;
// // 	let app: Express;
// // 	const validToken = 'valid.jwt.token';

// // 	beforeEach(async () => {
// // 		server = await appServer.start(0, (expressApp) => {
// // 			app = expressApp;
// // 			registerAffirmationRoutes(expressApp);
// // 		});

// // 		// Clear all mocks before each test
// // 		vi.clearAllMocks();
// // 	});

// // 	afterEach(() => {
// // 		server.stop();
// // 	});

// // 	describe('GET /api/affirmation/today', () => {
// // 		test("returns today's affirmation for a specific mood", async () => {
// // 			// Mock affirmation find
// // 			(prisma.affirmation.findMany as any).mockResolvedValueOnce([
// // 				sampleAffirmations[0],
// // 			]);

// // 			const response = await fetch(
// // 				`${server.address}/api/affirmation/today?mood=Happy`,
// // 				{
// // 					method: 'GET',
// // 					headers: {
// // 						Authorization: `Bearer ${validToken}`,
// // 					},
// // 				}
// // 			);

// // 			expect(response.status).toBe(200);
// // 			const data = await response.json();
// // 			expect(data.id).toBe(sampleAffirmations[0].id);
// // 			expect(data.content).toBe(sampleAffirmations[0].content);
// // 			expect(data.mood_type).toBe('Happy');

// // 			// Verify jwt.verify was called
// // 			expect(jwt.verify).toHaveBeenCalled();

// // 			// Verify affirmation was queried for the correct mood
// // 			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
// // 				where: {
// // 					mood_type: 'Happy',
// // 				},
// // 				orderBy: {
// // 					id: 'asc',
// // 				},
// // 				take: 1,
// // 			});
// // 		});

// // 		test('returns a fallback affirmation if mood-specific one is not found', async () => {
// // 			// Mock no affirmations for specific mood, then fallback
// // 			(prisma.affirmation.findMany as any).mockResolvedValueOnce([]);
// // 			(prisma.affirmation.findMany as any).mockResolvedValueOnce([
// // 				sampleAffirmations[1],
// // 			]);

// // 			const response = await fetch(
// // 				`${server.address}/api/affirmation/today?mood=NonExistent`,
// // 				{
// // 					method: 'GET',
// // 					headers: {
// // 						Authorization: `Bearer ${validToken}`,
// // 					},
// // 				}
// // 			);

// // 			expect(response.status).toBe(200);
// // 			const data = await response.json();
// // 			expect(data.id).toBe(sampleAffirmations[1].id);

// // 			// Verify affirmation was queried for the fallback mood (Reflective)
// // 			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
// // 				where: {
// // 					mood_type: 'Reflective',
// // 				},
// // 				orderBy: {
// // 					id: 'asc',
// // 				},
// // 				take: 1,
// // 			});
// // 		});

// // 		test('returns 404 if no affirmations are found', async () => {
// // 			// Mock no affirmations found for specific mood or fallback
// // 			(prisma.affirmation.findMany as any).mockResolvedValueOnce([]);
// // 			(prisma.affirmation.findMany as any).mockResolvedValueOnce([]);

// // 			const response = await fetch(
// // 				`${server.address}/api/affirmation/today?mood=NonExistent`,
// // 				{
// // 					method: 'GET',
// // 					headers: {
// // 						Authorization: `Bearer ${validToken}`,
// // 					},
// // 				}
// // 			);

// // 			expect(response.status).toBe(404);
// // 			const data = await response.json();
// // 			expect(data.error).toBe('No affirmations found');
// // 		});

// // 		test('returns 401 if no auth token is provided', async () => {
// // 			const response = await fetch(
// // 				`${server.address}/api/affirmation/today?mood=Happy`,
// // 				{
// // 					method: 'GET',
// // 					headers: {
// // 						// No Authorization header
// // 					},
// // 				}
// // 			);

// // 			expect(response.status).toBe(401);
// // 			const data = await response.json();
// // 			expect(data.error).toBe('Access denied. No token provided.');
// // 		});
// // 	});

// // 	describe('GET /api/affirmations/:mood', () => {
// // 		test('returns all affirmations for a specific mood', async () => {
// // 			// Mock affirmation find for the mood
// // 			(prisma.affirmation.findMany as any).mockResolvedValueOnce([
// // 				sampleAffirmations[0],
// // 			]);

// // 			const response = await fetch(`${server.address}/api/affirmations/Happy`, {
// // 				method: 'GET',
// // 				headers: {
// // 					Authorization: `Bearer ${validToken}`,
// // 				},
// // 			});

// // 			expect(response.status).toBe(200);
// // 			const data = await response.json();
// // 			expect(Array.isArray(data)).toBe(true);
// // 			expect(data.length).toBe(1);
// // 			expect(data[0].id).toBe(sampleAffirmations[0].id);
// // 			expect(data[0].mood_type).toBe('Happy');

// // 			// Verify affirmations were queried for the correct mood
// // 			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
// // 				where: {
// // 					mood_type: 'Happy',
// // 				},
// // 			});
// // 		});

// // 		test('returns 404 if no affirmations for the mood are found', async () => {
// // 			// Mock no affirmations found for the mood
// // 			(prisma.affirmation.findMany as any).mockResolvedValueOnce([]);

// // 			const response = await fetch(
// // 				`${server.address}/api/affirmations/NonExistent`,
// // 				{
// // 					method: 'GET',
// // 					headers: {
// // 						Authorization: `Bearer ${validToken}`,
// // 					},
// // 				}
// // 			);

// // 			expect(response.status).toBe(404);
// // 			const data = await response.json();
// // 			expect(data.error).toBe('No affirmations found for the specified mood');
// // 		});
// // 	});
// // });

// import express, { Express } from 'express';
// import jwt from 'jsonwebtoken';
// import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
// import { appServer, AppServer } from '../../webSupport/appServer';

// // Create mocks
// vi.mock('../../lib/prisma', () => {
// 	return {
// 		prisma: {
// 			affirmation: {
// 				findMany: vi.fn(),
// 				findFirst: vi.fn(),
// 			},
// 		},
// 	};
// });

// // Import after mocking
// import { prisma } from '../../lib/prisma';
// import { registerAffirmationRoutes } from '../affirmationRoutes';

// // Mock JWT verification
// vi.mock('jsonwebtoken', () => ({
// 	verify: vi
// 		.fn()
// 		.mockReturnValue({
// 			userId: 1,
// 			username: 'testuser',
// 			email: 'test@example.com',
// 		}),
// 	sign: vi.fn().mockReturnValue('mocked.jwt.token'),
// }));

// // Sample data for tests
// const sampleAffirmations = [
// 	{
// 		id: 1,
// 		content: 'Your positive energy is contagious. Keep shining your light!',
// 		mood_type: 'Happy',
// 		created_at: new Date(),
// 		updated_at: new Date(),
// 	},
// 	{
// 		id: 2,
// 		content: 'Every moment of calm is a gift you give yourself.',
// 		mood_type: 'Calm',
// 		created_at: new Date(),
// 		updated_at: new Date(),
// 	},
// ];

// describe('affirmationRoutes', () => {
// 	let server: AppServer;
// 	let app: Express;
// 	const validToken = 'valid.jwt.token';

// 	beforeEach(async () => {
// 		vi.clearAllMocks();

// 		server = await appServer.start(0, (expressApp) => {
// 			// Add body-parser middleware
// 			expressApp.use(express.json());
// 			app = expressApp;
// 			registerAffirmationRoutes(expressApp);
// 		});
// 	});

// 	afterEach(() => {
// 		server.stop();
// 	});

// 	describe('GET /api/affirmation/today', () => {
// 		test("returns today's affirmation for a specific mood", async () => {
// 			// Mock affirmation find
// 			vi.mocked(prisma.affirmation.findMany).mockResolvedValueOnce([
// 				sampleAffirmations[0],
// 			]);

// 			const response = await fetch(
// 				`${server.address}/api/affirmation/today?mood=Happy`,
// 				{
// 					method: 'GET',
// 					headers: {
// 						Authorization: `Bearer ${validToken}`,
// 					},
// 				}
// 			);

// 			expect(response.status).toBe(200);
// 			const data = await response.json();
// 			expect(data.id).toBe(sampleAffirmations[0].id);
// 			expect(data.content).toBe(sampleAffirmations[0].content);
// 			expect(data.mood_type).toBe('Happy');

// 			// Verify jwt.verify was called
// 			expect(jwt.verify).toHaveBeenCalled();

// 			// Verify affirmation was queried for the correct mood
// 			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
// 				where: {
// 					mood_type: 'Happy',
// 				},
// 				orderBy: {
// 					id: 'asc',
// 				},
// 				take: 1,
// 			});
// 		});

// 		test('returns a fallback affirmation if mood-specific one is not found', async () => {
// 			// Mock no affirmations for specific mood, then fallback
// 			vi.mocked(prisma.affirmation.findMany)
// 				.mockResolvedValueOnce([])
// 				.mockResolvedValueOnce([sampleAffirmations[1]]);

// 			const response = await fetch(
// 				`${server.address}/api/affirmation/today?mood=NonExistent`,
// 				{
// 					method: 'GET',
// 					headers: {
// 						Authorization: `Bearer ${validToken}`,
// 					},
// 				}
// 			);

// 			expect(response.status).toBe(200);
// 			const data = await response.json();
// 			expect(data.id).toBe(sampleAffirmations[1].id);

// 			// Verify affirmation was queried for the fallback mood (Reflective)
// 			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
// 				where: {
// 					mood_type: 'Reflective',
// 				},
// 				orderBy: {
// 					id: 'asc',
// 				},
// 				take: 1,
// 			});
// 		});

// 		test('returns 404 if no affirmations are found', async () => {
// 			// Mock no affirmations found for specific mood or fallback
// 			vi.mocked(prisma.affirmation.findMany)
// 				.mockResolvedValueOnce([])
// 				.mockResolvedValueOnce([]);

// 			const response = await fetch(
// 				`${server.address}/api/affirmation/today?mood=NonExistent`,
// 				{
// 					method: 'GET',
// 					headers: {
// 						Authorization: `Bearer ${validToken}`,
// 					},
// 				}
// 			);

// 			expect(response.status).toBe(404);
// 			const data = await response.json();
// 			expect(data.error).toBe('No affirmations found');
// 		});

// 		test('returns 401 if no auth token is provided', async () => {
// 			const response = await fetch(
// 				`${server.address}/api/affirmation/today?mood=Happy`,
// 				{
// 					method: 'GET',
// 					headers: {
// 						// No Authorization header
// 					},
// 				}
// 			);

// 			expect(response.status).toBe(401);
// 			const data = await response.json();
// 			expect(data.error).toBe('Access denied. No token provided.');
// 		});
// 	});

// 	describe('GET /api/affirmations/:mood', () => {
// 		test('returns all affirmations for a specific mood', async () => {
// 			// Mock affirmation find for the mood
// 			vi.mocked(prisma.affirmation.findMany).mockResolvedValueOnce([
// 				sampleAffirmations[0],
// 			]);

// 			const response = await fetch(`${server.address}/api/affirmations/Happy`, {
// 				method: 'GET',
// 				headers: {
// 					Authorization: `Bearer ${validToken}`,
// 				},
// 			});

// 			expect(response.status).toBe(200);
// 			const data = await response.json();
// 			expect(Array.isArray(data)).toBe(true);
// 			expect(data.length).toBe(1);
// 			expect(data[0].id).toBe(sampleAffirmations[0].id);
// 			expect(data[0].mood_type).toBe('Happy');

// 			// Verify affirmations were queried for the correct mood
// 			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
// 				where: {
// 					mood_type: 'Happy',
// 				},
// 			});
// 		});

// 		test('returns 404 if no affirmations for the mood are found', async () => {
// 			// Mock no affirmations found for the mood
// 			vi.mocked(prisma.affirmation.findMany).mockResolvedValueOnce([]);

// 			const response = await fetch(
// 				`${server.address}/api/affirmations/NonExistent`,
// 				{
// 					method: 'GET',
// 					headers: {
// 						Authorization: `Bearer ${validToken}`,
// 					},
// 				}
// 			);

// 			expect(response.status).toBe(404);
// 			const data = await response.json();
// 			expect(data.error).toBe('No affirmations found for the specified mood');
// 		});
// 	});
// });

import express, { Express } from 'express';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { appServer, AppServer } from '../../webSupport/appServer';

// Set up mocks before imports
vi.mock('jsonwebtoken', () => {
	return {
		verify: vi
			.fn()
			.mockReturnValue({
				userId: 1,
				username: 'testuser',
				email: 'test@example.com',
			}),
		sign: vi.fn().mockReturnValue('mocked.jwt.token'),
		default: {
			verify: vi
				.fn()
				.mockReturnValue({
					userId: 1,
					username: 'testuser',
					email: 'test@example.com',
				}),
			sign: vi.fn().mockReturnValue('mocked.jwt.token'),
		},
	};
});

vi.mock('../../lib/prisma', () => {
	return {
		prisma: {
			affirmation: {
				findMany: vi.fn(),
				findFirst: vi.fn(),
			},
		},
	};
});

// Now import the mocked modules
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { registerAffirmationRoutes } from '../affirmationRoutes';

// Sample data for tests
const sampleAffirmations = [
	{
		id: 1,
		content: 'Your positive energy is contagious. Keep shining your light!',
		mood_type: 'Happy',
		created_at: new Date(),
		updated_at: new Date(),
	},
	{
		id: 2,
		content: 'Every moment of calm is a gift you give yourself.',
		mood_type: 'Calm',
		created_at: new Date(),
		updated_at: new Date(),
	},
];

describe('affirmationRoutes', () => {
	let server: AppServer;
	let app: Express;
	const validToken = 'valid.jwt.token';

	beforeEach(async () => {
		vi.clearAllMocks();

		server = await appServer.start(0, (expressApp) => {
			// Add body-parser middleware
			expressApp.use(express.json());
			app = expressApp;
			registerAffirmationRoutes(expressApp);
		});
	});

	afterEach(() => {
		server.stop();
	});

	describe('GET /api/affirmation/today', () => {
		test("returns today's affirmation for a specific mood", async () => {
			// Mock affirmation find
			vi.mocked(prisma.affirmation.findMany).mockResolvedValueOnce([
				sampleAffirmations[0],
			]);

			const response = await fetch(
				`${server.address}/api/affirmation/today?mood=Happy`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${validToken}`,
					},
				}
			);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.id).toBe(sampleAffirmations[0].id);
			expect(data.content).toBe(sampleAffirmations[0].content);
			expect(data.mood_type).toBe('Happy');

			// Verify jwt.verify was called
			expect(jwt.verify).toHaveBeenCalled();

			// Verify affirmation was queried for the correct mood
			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
				where: {
					mood_type: 'Happy',
				},
				orderBy: {
					id: 'asc',
				},
				take: 1,
			});
		});

		test('returns a fallback affirmation if mood-specific one is not found', async () => {
			// Mock no affirmations for specific mood, then fallback
			vi.mocked(prisma.affirmation.findMany)
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([sampleAffirmations[1]]);

			const response = await fetch(
				`${server.address}/api/affirmation/today?mood=NonExistent`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${validToken}`,
					},
				}
			);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.id).toBe(sampleAffirmations[1].id);

			// Verify affirmation was queried for the fallback mood (Reflective)
			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
				where: {
					mood_type: 'Reflective',
				},
				orderBy: {
					id: 'asc',
				},
				take: 1,
			});
		});

		test('returns 404 if no affirmations are found', async () => {
			// Mock no affirmations found for specific mood or fallback
			vi.mocked(prisma.affirmation.findMany)
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([]);

			const response = await fetch(
				`${server.address}/api/affirmation/today?mood=NonExistent`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${validToken}`,
					},
				}
			);

			expect(response.status).toBe(404);
			const data = await response.json();
			expect(data.error).toBe('No affirmations found');
		});

		test('returns 401 if no auth token is provided', async () => {
			const response = await fetch(
				`${server.address}/api/affirmation/today?mood=Happy`,
				{
					method: 'GET',
					headers: {
						// No Authorization header
					},
				}
			);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.error).toBe('Access denied. No token provided.');
		});
	});

	describe('GET /api/affirmations/:mood', () => {
		test('returns all affirmations for a specific mood', async () => {
			// Mock affirmation find for the mood
			vi.mocked(prisma.affirmation.findMany).mockResolvedValueOnce([
				sampleAffirmations[0],
			]);

			const response = await fetch(`${server.address}/api/affirmations/Happy`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${validToken}`,
				},
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBe(1);
			expect(data[0].id).toBe(sampleAffirmations[0].id);
			expect(data[0].mood_type).toBe('Happy');

			// Verify affirmations were queried for the correct mood
			expect(prisma.affirmation.findMany).toHaveBeenCalledWith({
				where: {
					mood_type: 'Happy',
				},
			});
		});

		test('returns 404 if no affirmations for the mood are found', async () => {
			// Mock no affirmations found for the mood
			vi.mocked(prisma.affirmation.findMany).mockResolvedValueOnce([]);

			const response = await fetch(
				`${server.address}/api/affirmations/NonExistent`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${validToken}`,
					},
				}
			);

			expect(response.status).toBe(404);
			const data = await response.json();
			expect(data.error).toBe('No affirmations found for the specified mood');
		});
	});
});
