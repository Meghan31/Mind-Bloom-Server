// src/routes/authRoutes.ts
import bcrypt from 'bcrypt';
import { Express } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

// Secret key for JWT signing - in production, store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

export const registerAuthRoutes = (app: Express) => {
	// Register a new user
	app.post('/api/auth/register', async (req, res) => {
		try {
			const { username, email, password } = req.body;

			// Logging for debugging
			console.log('Register request received:', { username, email });

			// Basic validation
			if (!username || !email || !password) {
				console.log('Registration failed: Missing fields');
				return res.status(400).json({ error: 'All fields are required' });
			}

			try {
				// Check if email already exists
				const existingUser = await prisma.user.findUnique({
					where: { email },
				});

				if (existingUser) {
					console.log(`Registration failed: Email ${email} already exists`);
					return res.status(400).json({ error: 'Email already registered' });
				}

				// Hash the password
				const saltRounds = 10;
				const passwordHash = await bcrypt.hash(password, saltRounds);

				// Insert new user
				const newUser = await prisma.user.create({
					data: {
						username,
						email,
						password_hash: passwordHash,
					},
				});

				console.log(
					`User registered successfully: ${newUser.email} (ID: ${newUser.id})`
				);
				res.status(201).json({ message: 'User registered successfully' });
			} catch (dbError) {
				console.error('Database error during registration:', dbError);
				res.status(500).json({
					error: 'Database error occurred',
					details: (dbError as Error).message,
				});
			}
		} catch (error) {
			console.error('Registration error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	});

	// Login user
	app.post('/api/auth/login', async (req, res) => {
		try {
			const { email, password } = req.body;

			// Logging for debugging
			console.log('Login request received:', { email });

			// Basic validation
			if (!email || !password) {
				console.log('Login failed: Missing email or password');
				return res
					.status(400)
					.json({ error: 'Email and password are required' });
			}

			try {
				// Check if user exists
				const user = await prisma.user.findUnique({
					where: { email },
				});

				if (!user) {
					console.log(`Login failed: User not found for email ${email}`);
					return res.status(401).json({ error: 'Invalid credentials' });
				}

				// Verify password
				const passwordMatch = await bcrypt.compare(
					password,
					user.password_hash
				);

				if (!passwordMatch) {
					console.log(`Login failed: Incorrect password for email ${email}`);
					return res.status(401).json({ error: 'Invalid credentials' });
				}

				// Create JWT token with proper typing
				const token = jwt.sign(
					{
						userId: user.id,
						email: user.email,
						username: user.username,
					},
					JWT_SECRET,
					{ expiresIn: JWT_EXPIRATION as jwt.SignOptions['expiresIn'] }
				);

				console.log(`User logged in successfully: ${email} (ID: ${user.id})`);
				console.log(`Token generated: ${token.substring(0, 20)}...`);

				// Return user info and token
				res.status(200).json({
					message: 'Login successful',
					token,
					user: {
						id: user.id,
						username: user.username,
						email: user.email,
					},
				});
			} catch (dbError) {
				console.error('Database error during login:', dbError);
				res.status(500).json({
					error: 'Database error occurred',
					details: (dbError as Error).message,
				});
			}
		} catch (error) {
			console.error('Login error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	});

	// Verify token endpoint (optional but useful for frontend validation)
	app.get('/api/auth/verify', async (req, res) => {
		try {
			const authHeader = req.headers['authorization'];
			const token = authHeader && authHeader.split(' ')[1];

			if (!token) {
				return res
					.status(401)
					.json({ valid: false, error: 'No token provided' });
			}

			jwt.verify(token, JWT_SECRET, async (err, decoded) => {
				if (err) {
					return res.status(401).json({ valid: false, error: 'Invalid token' });
				}

				// Verify that user still exists in database
				try {
					const user = await prisma.user.findUnique({
						where: { id: (decoded as any).userId },
					});

					if (!user) {
						return res
							.status(401)
							.json({ valid: false, error: 'User not found' });
					}

					return res.json({
						valid: true,
						user: {
							id: user.id,
							username: user.username,
							email: user.email,
						},
					});
				} catch (dbError) {
					console.error('Database error during token verification:', dbError);
					return res
						.status(500)
						.json({ valid: false, error: 'Database error' });
				}
			});
		} catch (error) {
			console.error('Token verification error:', error);
			res.status(500).json({ valid: false, error: 'Internal server error' });
		}
	});
};
