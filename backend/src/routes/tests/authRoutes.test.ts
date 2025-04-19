// // import bcrypt from 'bcrypt';
// // import { Express } from 'express';
// // import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
// // import { prisma } from '../../lib/prisma';
// // import { appServer, AppServer } from '../../webSupport/appServer';
// // import { registerAuthRoutes } from '.././authRoutes';

// // // Mock prisma
// // vi.mock('../lib/prisma', () => ({
// // 	prisma: {
// // 		user: {
// // 			findUnique: vi.fn(),
// // 			create: vi.fn(),
// // 		},
// // 	},
// // }));

// // // Mock bcrypt
// // vi.mock('bcrypt', () => ({
// // 	hash: vi.fn().mockResolvedValue('hashed_password'),
// // 	compare: vi.fn().mockResolvedValue(true),
// // }));

// // describe('authRoutes', () => {
// // 	let server: AppServer;
// // 	let app: Express;

// // 	beforeEach(async () => {
// // 		server = await appServer.start(0, (expressApp) => {
// // 			app = expressApp;
// // 			registerAuthRoutes(expressApp);
// // 		});

// // 		// Clear all mocks before each test
// // 		vi.clearAllMocks();
// // 	});

// // 	afterEach(() => {
// // 		server.stop();
// // 	});

// // 	describe('POST /api/auth/register', () => {
// // 		test('registers a new user successfully', async () => {
// // 			// Mock user does not exist yet
// // 			(prisma.user.findUnique as any).mockResolvedValueOnce(null);

// // 			// Mock successful user creation
// // 			(prisma.user.create as any).mockResolvedValueOnce({
// // 				id: 1,
// // 				username: 'testuser',
// // 				email: 'test@example.com',
// // 				password_hash: 'hashed_password',
// // 			});

// // 			const response = await fetch(`${server.address}/api/auth/register`, {
// // 				method: 'POST',
// // 				headers: { 'Content-Type': 'application/json' },
// // 				body: JSON.stringify({
// // 					username: 'testuser',
// // 					email: 'test@example.com',
// // 					password: 'password123',
// // 				}),
// // 			});

// // 			expect(response.status).toBe(201);
// // 			const data = await response.json();
// // 			expect(data.message).toBe('User registered successfully');

// // 			// Verify that proper functions were called
// // 			expect(prisma.user.findUnique).toHaveBeenCalledWith({
// // 				where: { email: 'test@example.com' },
// // 			});
// // 			expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
// // 			expect(prisma.user.create).toHaveBeenCalledWith({
// // 				data: {
// // 					username: 'testuser',
// // 					email: 'test@example.com',
// // 					password_hash: 'hashed_password',
// // 				},
// // 			});
// // 		});

// // 		test('returns 400 if user already exists', async () => {
// // 			// Mock user already exists
// // 			(prisma.user.findUnique as any).mockResolvedValueOnce({
// // 				id: 1,
// // 				username: 'existinguser',
// // 				email: 'existing@example.com',
// // 			});

// // 			const response = await fetch(`${server.address}/api/auth/register`, {
// // 				method: 'POST',
// // 				headers: { 'Content-Type': 'application/json' },
// // 				body: JSON.stringify({
// // 					username: 'existinguser',
// // 					email: 'existing@example.com',
// // 					password: 'password123',
// // 				}),
// // 			});

// // 			expect(response.status).toBe(400);
// // 			const data = await response.json();
// // 			expect(data.error).toBe('Email already registered');

// // 			// Verify user.create was not called
// // 			expect(prisma.user.create).not.toHaveBeenCalled();
// // 		});

// // 		test('returns 400 if request is missing required fields', async () => {
// // 			const response = await fetch(`${server.address}/api/auth/register`, {
// // 				method: 'POST',
// // 				headers: { 'Content-Type': 'application/json' },
// // 				body: JSON.stringify({
// // 					username: 'testuser',
// // 					// Missing email
// // 					password: 'password123',
// // 				}),
// // 			});

// // 			expect(response.status).toBe(400);
// // 			const data = await response.json();
// // 			expect(data.error).toBe('All fields are required');
// // 		});
// // 	});

// // 	describe('POST /api/auth/login', () => {
// // 		test('logs in a user successfully', async () => {
// // 			// Mock user exists
// // 			(prisma.user.findUnique as any).mockResolvedValueOnce({
// // 				id: 1,
// // 				username: 'testuser',
// // 				email: 'test@example.com',
// // 				password_hash: 'hashed_password',
// // 			});

// // 			const response = await fetch(`${server.address}/api/auth/login`, {
// // 				method: 'POST',
// // 				headers: { 'Content-Type': 'application/json' },
// // 				body: JSON.stringify({
// // 					email: 'test@example.com',
// // 					password: 'password123',
// // 				}),
// // 			});

// // 			expect(response.status).toBe(200);
// // 			const data = await response.json();
// // 			expect(data.message).toBe('Login successful');
// // 			expect(data.token).toBeDefined();
// // 			expect(data.user).toEqual({
// // 				id: 1,
// // 				username: 'testuser',
// // 				email: 'test@example.com',
// // 			});

// // 			// Verify bcrypt compare was called
// // 			expect(bcrypt.compare).toHaveBeenCalledWith(
// // 				'password123',
// // 				'hashed_password'
// // 			);
// // 		});

// // 		test('returns 401 if user does not exist', async () => {
// // 			// Mock user does not exist
// // 			(prisma.user.findUnique as any).mockResolvedValueOnce(null);

// // 			const response = await fetch(`${server.address}/api/auth/login`, {
// // 				method: 'POST',
// // 				headers: { 'Content-Type': 'application/json' },
// // 				body: JSON.stringify({
// // 					email: 'nonexistent@example.com',
// // 					password: 'password123',
// // 				}),
// // 			});

// // 			expect(response.status).toBe(401);
// // 			const data = await response.json();
// // 			expect(data.error).toBe('Invalid credentials');

// // 			// Verify bcrypt compare was not called
// // 			expect(bcrypt.compare).not.toHaveBeenCalled();
// // 		});

// // 		test('returns 401 if password is incorrect', async () => {
// // 			// Mock user exists
// // 			(prisma.user.findUnique as any).mockResolvedValueOnce({
// // 				id: 1,
// // 				username: 'testuser',
// // 				email: 'test@example.com',
// // 				password_hash: 'hashed_password',
// // 			});

// // 			// Mock password doesn't match
// // 			(bcrypt.compare as any).mockResolvedValueOnce(false);

// // 			const response = await fetch(`${server.address}/api/auth/login`, {
// // 				method: 'POST',
// // 				headers: { 'Content-Type': 'application/json' },
// // 				body: JSON.stringify({
// // 					email: 'test@example.com',
// // 					password: 'wrongpassword',
// // 				}),
// // 			});

// // 			expect(response.status).toBe(401);
// // 			const data = await response.json();
// // 			expect(data.error).toBe('Invalid credentials');
// // 		});

// // 		test('returns 400 if request is missing required fields', async () => {
// // 			const response = await fetch(`${server.address}/api/auth/login`, {
// // 				method: 'POST',
// // 				headers: { 'Content-Type': 'application/json' },
// // 				body: JSON.stringify({
// // 					// Missing email
// // 					password: 'password123',
// // 				}),
// // 			});

// // 			expect(response.status).toBe(400);
// // 			const data = await response.json();
// // 			expect(data.error).toBe('Email and password are required');
// // 		});
// // 	});
// // });

// import bcrypt from 'bcrypt';
// import express, { Express } from 'express';
// import jwt from 'jsonwebtoken';
// import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
// import { appServer, AppServer } from '../../webSupport/appServer';

// // Create mocks
// vi.mock('../../lib/prisma', () => {
// 	return {
// 		prisma: {
// 			user: {
// 				findUnique: vi.fn(),
// 				create: vi.fn(),
// 			},
// 		},
// 	};
// });

// // Import after mocking
// import { prisma } from '../../lib/prisma';
// import { registerAuthRoutes } from '../authRoutes';

// // Mock bcrypt
// vi.mock('bcrypt', () => ({
// 	hash: vi.fn().mockResolvedValue('hashed_password'),
// 	compare: vi.fn().mockResolvedValue(true),
// }));

// // Mock jwt
// vi.mock('jsonwebtoken', () => ({
// 	sign: vi.fn().mockReturnValue('mocked.jwt.token'),
// }));

// describe('authRoutes', () => {
// 	let server: AppServer;
// 	let app: Express;

// 	beforeEach(async () => {
// 		vi.clearAllMocks();

// 		server = await appServer.start(0, (expressApp) => {
// 			// Add body-parser middleware to handle request body
// 			expressApp.use(express.json());
// 			app = expressApp;
// 			registerAuthRoutes(expressApp);
// 		});
// 	});

// 	afterEach(() => {
// 		server.stop();
// 	});

// 	describe('POST /api/auth/register', () => {
// 		test('registers a new user successfully', async () => {
// 			// Mock user does not exist yet
// 			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

// 			// Mock successful user creation
// 			vi.mocked(prisma.user.create).mockResolvedValueOnce({
// 				id: 1,
// 				username: 'testuser',
// 				email: 'test@example.com',
// 				password_hash: 'hashed_password',
// 				created_at: new Date(),
// 				updated_at: new Date(),
// 			});

// 			const response = await fetch(`${server.address}/api/auth/register`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					username: 'testuser',
// 					email: 'test@example.com',
// 					password: 'password123',
// 				}),
// 			});

// 			expect(response.status).toBe(201);
// 			const data = await response.json();
// 			expect(data.message).toBe('User registered successfully');

// 			// Verify that proper functions were called
// 			expect(prisma.user.findUnique).toHaveBeenCalledWith({
// 				where: { email: 'test@example.com' },
// 			});
// 			expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
// 			expect(prisma.user.create).toHaveBeenCalledWith({
// 				data: {
// 					username: 'testuser',
// 					email: 'test@example.com',
// 					password_hash: 'hashed_password',
// 				},
// 			});
// 		});

// 		test('returns 400 if user already exists', async () => {
// 			// Mock user already exists
// 			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
// 				id: 1,
// 				username: 'existinguser',
// 				email: 'existing@example.com',
// 				password_hash: 'hashed_password',
// 				created_at: new Date(),
// 				updated_at: new Date(),
// 			});

// 			const response = await fetch(`${server.address}/api/auth/register`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					username: 'existinguser',
// 					email: 'existing@example.com',
// 					password: 'password123',
// 				}),
// 			});

// 			expect(response.status).toBe(400);
// 			const data = await response.json();
// 			expect(data.error).toBe('Email already registered');

// 			// Verify user.create was not called
// 			expect(prisma.user.create).not.toHaveBeenCalled();
// 		});

// 		test('returns 400 if request is missing required fields', async () => {
// 			const response = await fetch(`${server.address}/api/auth/register`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					username: 'testuser',
// 					// Missing email
// 					password: 'password123',
// 				}),
// 			});

// 			expect(response.status).toBe(400);
// 			const data = await response.json();
// 			expect(data.error).toBe('All fields are required');
// 		});
// 	});

// 	describe('POST /api/auth/login', () => {
// 		test('logs in a user successfully', async () => {
// 			// Mock user exists
// 			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
// 				id: 1,
// 				username: 'testuser',
// 				email: 'test@example.com',
// 				password_hash: 'hashed_password',
// 				created_at: new Date(),
// 				updated_at: new Date(),
// 			});

// 			const response = await fetch(`${server.address}/api/auth/login`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					email: 'test@example.com',
// 					password: 'password123',
// 				}),
// 			});

// 			expect(response.status).toBe(200);
// 			const data = await response.json();
// 			expect(data.message).toBe('Login successful');
// 			expect(data.token).toBeDefined();
// 			expect(data.user).toEqual({
// 				id: 1,
// 				username: 'testuser',
// 				email: 'test@example.com',
// 			});

// 			// Verify bcrypt compare was called
// 			expect(bcrypt.compare).toHaveBeenCalledWith(
// 				'password123',
// 				'hashed_password'
// 			);
// 		});

// 		test('returns 401 if user does not exist', async () => {
// 			// Mock user does not exist
// 			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

// 			const response = await fetch(`${server.address}/api/auth/login`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					email: 'nonexistent@example.com',
// 					password: 'password123',
// 				}),
// 			});

// 			expect(response.status).toBe(401);
// 			const data = await response.json();
// 			expect(data.error).toBe('Invalid credentials');

// 			// Verify bcrypt compare was not called
// 			expect(bcrypt.compare).not.toHaveBeenCalled();
// 		});

// 		test('returns 401 if password is incorrect', async () => {
// 			// Mock user exists
// 			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
// 				id: 1,
// 				username: 'testuser',
// 				email: 'test@example.com',
// 				password_hash: 'hashed_password',
// 				created_at: new Date(),
// 				updated_at: new Date(),
// 			});

// 			// Mock password doesn't match
// 			vi.mocked(bcrypt.compare).mockResolvedValueOnce();

// 			const response = await fetch(`${server.address}/api/auth/login`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					email: 'test@example.com',
// 					password: 'wrongpassword',
// 				}),
// 			});

// 			expect(response.status).toBe(401);
// 			const data = await response.json();
// 			expect(data.error).toBe('Invalid credentials');
// 		});

// 		test('returns 400 if request is missing required fields', async () => {
// 			const response = await fetch(`${server.address}/api/auth/login`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					// Missing email
// 					password: 'password123',
// 				}),
// 			});

// 			expect(response.status).toBe(400);
// 			const data = await response.json();
// 			expect(data.error).toBe('Email and password are required');
// 		});
// 	});
// });

import express, { Express } from 'express';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { appServer, AppServer } from '../../webSupport/appServer';

// Set up mocks before imports
vi.mock('bcrypt', () => {
	return {
		hash: vi.fn().mockResolvedValue('hashed_password'),
		compare: vi.fn().mockResolvedValue(true),
		default: {
			hash: vi.fn().mockResolvedValue('hashed_password'),
			compare: vi.fn().mockResolvedValue(true),
		},
	};
});

vi.mock('jsonwebtoken', () => {
	return {
		sign: vi.fn().mockReturnValue('mocked.jwt.token'),
		verify: vi.fn().mockReturnValue({
			userId: 1,
			username: 'testuser',
			email: 'test@example.com',
		}),
		default: {
			sign: vi.fn().mockReturnValue('mocked.jwt.token'),
			verify: vi.fn().mockReturnValue({
				userId: 1,
				username: 'testuser',
				email: 'test@example.com',
			}),
		},
	};
});

vi.mock('../../lib/prisma', () => {
	return {
		prisma: {
			user: {
				findUnique: vi.fn(),
				create: vi.fn(),
			},
		},
	};
});

// Now import the mocked modules
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { registerAuthRoutes } from '../authRoutes';

describe('authRoutes', () => {
	let server: AppServer;
	let app: Express;

	beforeEach(async () => {
		vi.clearAllMocks();

		server = await appServer.start(0, (expressApp) => {
			// Add body-parser middleware to handle request body
			expressApp.use(express.json());
			app = expressApp;
			registerAuthRoutes(expressApp);
		});
	});

	afterEach(() => {
		server.stop();
	});

	describe('POST /api/auth/register', () => {
		test('registers a new user successfully', async () => {
			// Mock user does not exist yet
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

			// Mock successful user creation
			vi.mocked(prisma.user.create).mockResolvedValueOnce({
				id: 1,
				username: 'testuser',
				email: 'test@example.com',
				password_hash: 'hashed_password',
				created_at: new Date(),
				updated_at: new Date(),
			});

			const response = await fetch(`${server.address}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'testuser',
					email: 'test@example.com',
					password: 'password123',
				}),
			});

			expect(response.status).toBe(201);
			const data = await response.json();
			expect(data.message).toBe('User registered successfully');

			// Verify that proper functions were called
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { email: 'test@example.com' },
			});

			expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

			expect(prisma.user.create).toHaveBeenCalledWith({
				data: {
					username: 'testuser',
					email: 'test@example.com',
					password_hash: 'hashed_password',
				},
			});
		});

		test('returns 400 if user already exists', async () => {
			// Mock user already exists
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
				id: 1,
				username: 'existinguser',
				email: 'existing@example.com',
				password_hash: 'hashed_password',
				created_at: new Date(),
				updated_at: new Date(),
			});

			const response = await fetch(`${server.address}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'existinguser',
					email: 'existing@example.com',
					password: 'password123',
				}),
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.error).toBe('Email already registered');

			// Verify user.create was not called
			expect(prisma.user.create).not.toHaveBeenCalled();
		});

		test('returns 400 if request is missing required fields', async () => {
			const response = await fetch(`${server.address}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'testuser',
					// Missing email
					password: 'password123',
				}),
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.error).toBe('All fields are required');
		});
	});

	describe('POST /api/auth/login', () => {
		test('logs in a user successfully', async () => {
			// Mock user exists
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
				id: 1,
				username: 'testuser',
				email: 'test@example.com',
				password_hash: 'hashed_password',
				created_at: new Date(),
				updated_at: new Date(),
			});

			const response = await fetch(`${server.address}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'test@example.com',
					password: 'password123',
				}),
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toBe('Login successful');
			expect(data.token).toBeDefined();
			expect(data.user).toEqual({
				id: 1,
				username: 'testuser',
				email: 'test@example.com',
			});

			// Verify bcrypt compare was called
			expect(bcrypt.compare).toHaveBeenCalledWith(
				'password123',
				'hashed_password'
			);
		});

		test('returns 401 if user does not exist', async () => {
			// Mock user does not exist
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

			const response = await fetch(`${server.address}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'nonexistent@example.com',
					password: 'password123',
				}),
			});

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.error).toBe('Invalid credentials');

			// Verify bcrypt compare was not called
			expect(bcrypt.compare).not.toHaveBeenCalled();
		});

		test('returns 401 if password is incorrect', async () => {
			// Mock user exists
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
				id: 1,
				username: 'testuser',
				email: 'test@example.com',
				password_hash: 'hashed_password',
				created_at: new Date(),
				updated_at: new Date(),
			});

			// Mock password doesn't match
			vi.mocked(bcrypt.compare).mockResolvedValueOnce();

			const response = await fetch(`${server.address}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'test@example.com',
					password: 'wrongpassword',
				}),
			});

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.error).toBe('Invalid credentials');
		});

		test('returns 400 if request is missing required fields', async () => {
			const response = await fetch(`${server.address}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					// Missing email
					password: 'password123',
				}),
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.error).toBe('Email and password are required');
		});
	});
});
