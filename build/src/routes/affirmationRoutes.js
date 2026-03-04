"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAffirmationRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const validate_1 = require("../middleware/validate");
const registerAffirmationRoutes = (app) => {
    // ── GET /api/affirmation/today?mood=Calm ──────────────────────
    // Hard-capped at 10 requests per day per IP
    app.get('/api/affirmation/today', auth_1.authenticateToken, rateLimiter_1.affirmationTodayLimiter, validate_1.validateMoodQuery, async (req, res) => {
        try {
            const mood = req.query.mood || 'Reflective';
            // Pick a random affirmation by randomly choosing sort direction
            const direction = Math.random() > 0.5 ? 'asc' : 'desc';
            let affirmation = await prisma_1.prisma.affirmation.findFirst({
                where: { mood_type: mood },
                orderBy: { id: direction },
            });
            // Fallback to any mood if nothing found for the requested one
            if (!affirmation) {
                affirmation = await prisma_1.prisma.affirmation.findFirst({
                    where: { mood_type: 'Reflective' },
                    orderBy: { id: 'asc' },
                });
            }
            if (!affirmation) {
                res.status(404).json({ error: 'No affirmations found.' });
                return;
            }
            res.status(200).json(affirmation);
        }
        catch (err) {
            console.error('[Affirmation] Today error:', err.message);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
    // ── GET /api/affirmations/:mood — all for a mood ──────────────
    app.get('/api/affirmations/:mood', auth_1.authenticateToken, rateLimiter_1.readLimiter, validate_1.validateMoodParam, async (req, res) => {
        try {
            const { mood } = req.params;
            const affirmations = await prisma_1.prisma.affirmation.findMany({
                where: { mood_type: mood },
            });
            if (affirmations.length === 0) {
                res.status(404).json({ error: 'No affirmations found for that mood.' });
                return;
            }
            res.status(200).json(affirmations);
        }
        catch (err) {
            console.error('[Affirmation] List error:', err.message);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
};
exports.registerAffirmationRoutes = registerAffirmationRoutes;
