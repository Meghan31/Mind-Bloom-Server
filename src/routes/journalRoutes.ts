// src/routes/journalRoutes.ts
import { Express } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

// Improved middleware to verify JWT token
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

// Helper function to get current date in Mountain Standard Time (MST)
const getMSTDate = (): Date => {
	// Create a new date object for the current time
	const now = new Date();

	// Get the date in Mountain time (UTC-7 or UTC-6 depending on daylight saving)
	// For more accuracy, we can use the Intl.DateTimeFormat API to get the proper timezone
	return new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
};

export const registerJournalRoutes = (app: Express) => {
	console.log('Registering journal routes');

	// Create a new journal entry
	app.post('/api/journal', authenticateToken, async (req: any, res: any) => {
		console.log('POST /api/journal received:', req.body);

		try {
			const { content, mood } = req.body;
			const userId = req.user.userId;

			console.log(
				`Creating journal entry for user ${userId} with mood: ${mood}`
			);

			// Validate request
			if (!content || !mood) {
				return res.status(400).json({ error: 'Content and mood are required' });
			}

			// Get a random affirmation based on mood
			const affirmation = await prisma.affirmation.findFirst({
				where: { mood_type: mood },
				orderBy: { id: 'asc' }, // Using asc for deterministic ordering
				take: 1,
			});

			console.log(`Selected affirmation: ${affirmation?.id || 'none'}`);

			// Get current date in MST timezone
			const mstDate = getMSTDate();
			console.log(`Using MST date: ${mstDate.toISOString()}`);

			// Insert journal entry with MST date
			const entry = await prisma.journalEntry.create({
				data: {
					user_id: userId,
					content,
					mood,
					affirmation_id: affirmation?.id || null,
					entry_date: mstDate,
				},
			});

			console.log(`Journal entry created with ID: ${entry.id}`);

			// Return the entry with the affirmation
			res.status(201).json({
				message: 'Journal entry created successfully',
				entry,
				affirmation: affirmation?.content || null,
			});
		} catch (error) {
			console.error('Journal entry creation error:', error);
			res.status(500).json({
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	});

	// Get all journal entries for the logged-in user
	app.get('/api/journal', authenticateToken, async (req: any, res: any) => {
		console.log('GET /api/journal received');

		try {
			const userId = req.user.userId;
			console.log(`Fetching all journal entries for user ${userId}`);

			// Get all entries for the user with affirmations
			const entries = await prisma.journalEntry.findMany({
				where: { user_id: userId },
				include: {
					affirmation: true,
				},
				orderBy: { entry_date: 'desc' },
			});

			// Transform data to match the expected format
			const formattedEntries = entries.map((entry) => ({
				id: entry.id,
				user_id: entry.user_id,
				content: entry.content,
				mood: entry.mood,
				affirmation_id: entry.affirmation_id,
				entry_date: entry.entry_date.toISOString().split('T')[0],
				created_at: entry.created_at.toISOString(),
				updated_at: entry.updated_at.toISOString(),
				affirmation_content: entry.affirmation?.content || null,
				mood_type: entry.affirmation?.mood_type || null,
			}));

			console.log(
				`Retrieved ${formattedEntries.length} entries for user ${userId}`
			);
			res.status(200).json(formattedEntries);
		} catch (error) {
			console.error('Journal entries fetch error:', error);
			res.status(500).json({
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	});

	// Get a specific journal entry by ID
	app.get('/api/journal/:id', authenticateToken, async (req: any, res: any) => {
		console.log(`GET /api/journal/${req.params.id} received`);

		try {
			const userId = req.user.userId;
			const entryId = parseInt(req.params.id);

			console.log(`Fetching journal entry ${entryId} for user ${userId}`);

			// Get the entry with affirmation
			const entry = await prisma.journalEntry.findUnique({
				where: {
					id: entryId,
					user_id: userId,
				},
				include: {
					affirmation: true,
				},
			});

			if (!entry) {
				return res.status(404).json({ error: 'Journal entry not found' });
			}

			// Format the entry to match expected format
			const formattedEntry = {
				id: entry.id,
				user_id: entry.user_id,
				content: entry.content,
				mood: entry.mood,
				affirmation_id: entry.affirmation_id,
				entry_date: entry.entry_date.toISOString().split('T')[0],
				created_at: entry.created_at.toISOString(),
				updated_at: entry.updated_at.toISOString(),
				affirmation_content: entry.affirmation?.content || null,
				mood_type: entry.affirmation?.mood_type || null,
			};

			res.status(200).json(formattedEntry);
		} catch (error) {
			console.error('Journal entry fetch error:', error);
			res.status(500).json({
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	});

	// Get entries by date
	app.get(
		'/api/journal/date/:date',
		authenticateToken,
		async (req: any, res: any) => {
			console.log(`GET /api/journal/date/${req.params.date} received`);

			try {
				const userId = req.user.userId;
				const dateString = req.params.date; // Format: YYYY-MM-DD

				console.log(
					`Fetching journal entries for date ${dateString} and user ${userId}`
				);

				// For MST timezone, create a date range with proper UTC offset
				const startOfDay = new Date(`${dateString}T00:00:00-07:00`);
				const endOfDay = new Date(`${dateString}T23:59:59-07:00`);

				console.log(
					`Date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`
				);

				// Get entries with entry_date within the specified date
				const entries = await prisma.journalEntry.findMany({
					where: {
						user_id: userId,
						entry_date: {
							gte: startOfDay,
							lte: endOfDay,
						},
					},
					include: {
						affirmation: true,
					},
					orderBy: { created_at: 'desc' },
				});

				// Format entries to match expected format
				const formattedEntries = entries.map((entry) => ({
					id: entry.id,
					user_id: entry.user_id,
					content: entry.content,
					mood: entry.mood,
					affirmation_id: entry.affirmation_id,
					entry_date: entry.entry_date.toISOString().split('T')[0],
					created_at: entry.created_at.toISOString(),
					updated_at: entry.updated_at.toISOString(),
					affirmation_content: entry.affirmation?.content || null,
					mood_type: entry.affirmation?.mood_type || null,
				}));

				console.log(
					`Retrieved ${formattedEntries.length} entries for date ${dateString}`
				);
				res.status(200).json(formattedEntries);
			} catch (error) {
				console.error('Journal entries by date fetch error:', error);
				res.status(500).json({
					error: 'Internal server error',
					details: error instanceof Error ? error.message : 'Unknown error',
				});
			}
		}
	);
};
