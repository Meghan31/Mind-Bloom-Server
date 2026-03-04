// src/routes/affirmationRoutes.ts
import { Express } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { affirmationTodayLimiter, readLimiter } from '../middleware/rateLimiter';
import { validateMoodParam, validateMoodQuery } from '../middleware/validate';

export const registerAffirmationRoutes = (app: Express) => {
	// ── GET /api/affirmation/today?mood=Calm ──────────────────────
	// Hard-capped at 10 requests per day per IP
	app.get(
		'/api/affirmation/today',
		authenticateToken,
		affirmationTodayLimiter,
		validateMoodQuery,
		async (req: any, res) => {
			try {
				const mood = (req.query.mood as string) || 'Reflective';

				// Pick a random affirmation by randomly choosing sort direction
				const direction = Math.random() > 0.5 ? 'asc' : 'desc' as const;

				let affirmation = await prisma.affirmation.findFirst({
					where:   { mood_type: mood },
					orderBy: { id: direction },
				});

				// Fallback to any mood if nothing found for the requested one
				if (!affirmation) {
					affirmation = await prisma.affirmation.findFirst({
						where:   { mood_type: 'Reflective' },
						orderBy: { id: 'asc' },
					});
				}

				if (!affirmation) {
					res.status(404).json({ error: 'No affirmations found.' });
					return;
				}

				res.status(200).json(affirmation);
			} catch (err) {
				console.error('[Affirmation] Today error:', (err as Error).message);
				res.status(500).json({ error: 'Internal server error.' });
			}
		}
	);

	// ── GET /api/affirmations/:mood — all for a mood ──────────────
	app.get(
		'/api/affirmations/:mood',
		authenticateToken,
		readLimiter,
		validateMoodParam,
		async (req, res) => {
			try {
				const { mood } = req.params;

				const affirmations = await prisma.affirmation.findMany({
					where: { mood_type: mood },
				});

				if (affirmations.length === 0) {
					res.status(404).json({ error: 'No affirmations found for that mood.' });
					return;
				}

				res.status(200).json(affirmations);
			} catch (err) {
				console.error('[Affirmation] List error:', (err as Error).message);
				res.status(500).json({ error: 'Internal server error.' });
			}
		}
	);
};
