// src/routes/affirmationRoutes.ts
import { Express } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

// Middleware to verify JWT token (same as in journalRoutes.ts for consistency)
const authenticateToken = (req: any, res: any, next: any) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		console.log('Authentication failed: No token provided');
		return res.status(401).json({ error: 'Access denied. No token provided.' });
	}

	try {
		const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		console.log(
			`Authentication successful for user: ${(decoded as any).userId}`
		);
		next();
	} catch (error) {
		console.error('Authentication failed: Invalid token', error);
		return res.status(403).json({ error: 'Invalid token.' });
	}
};

export const registerAffirmationRoutes = (app: Express) => {
	console.log('Registering affirmation routes');

	// Get today's affirmation for a specific mood
	app.get(
		'/api/affirmation/today',
		authenticateToken,
		async (req: any, res: any) => {
			try {
				// Get mood from query params, default to Reflective
				const mood = req.query.mood || 'Reflective';
				const userId = req.user.userId;

				console.log(
					`Fetching today's affirmation for mood: ${mood} (User: ${userId})`
				);

				// Get a random affirmation based on mood
				const affirmations = await prisma.affirmation.findMany({
					where: {
						mood_type: mood,
					},
					orderBy: {
						// Use a more random approach
						id: Math.random() > 0.5 ? 'asc' : 'desc',
					},
					take: 1,
				});

				if (affirmations.length === 0) {
					console.log(
						`No affirmations found for mood: ${mood}, attempting fallback`
					);

					// If no affirmation for specific mood, try to get a fallback
					const fallbackAffirmations = await prisma.affirmation.findMany({
						where: {
							mood_type: 'Reflective',
						},
						orderBy: {
							id: 'asc',
						},
						take: 1,
					});

					if (fallbackAffirmations.length === 0) {
						console.log('No fallback affirmations found');
						return res.status(404).json({ error: 'No affirmations found' });
					}

					console.log(
						`Returning fallback affirmation: ${fallbackAffirmations[0].id}`
					);
					return res.status(200).json(fallbackAffirmations[0]);
				}

				console.log(`Returning affirmation: ${affirmations[0].id}`);
				res.status(200).json(affirmations[0]);
			} catch (error) {
				console.error('Affirmation fetch error:', error);
				res.status(500).json({
					error: 'Internal server error',
					details: error instanceof Error ? error.message : 'Unknown error',
				});
			}
		}
	);

	// Get all affirmations for a specific mood
	app.get(
		'/api/affirmations/:mood',
		authenticateToken,
		async (req: any, res: any) => {
			try {
				const mood = req.params.mood;
				const userId = req.user.userId;

				console.log(
					`Fetching all affirmations for mood: ${mood} (User: ${userId})`
				);

				// Get all affirmations for the mood
				const affirmations = await prisma.affirmation.findMany({
					where: {
						mood_type: mood,
					},
				});

				if (affirmations.length === 0) {
					console.log(`No affirmations found for mood: ${mood}`);
					return res
						.status(404)
						.json({ error: 'No affirmations found for the specified mood' });
				}

				console.log(
					`Returning ${affirmations.length} affirmations for mood: ${mood}`
				);
				res.status(200).json(affirmations);
			} catch (error) {
				console.error('Affirmations fetch error:', error);
				res.status(500).json({
					error: 'Internal server error',
					details: error instanceof Error ? error.message : 'Unknown error',
				});
			}
		}
	);
};
