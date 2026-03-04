"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJournalRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const validate_1 = require("../middleware/validate");
const getMSTDate = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }));
const formatEntry = (entry) => ({
    id: entry.id,
    user_id: entry.user_id,
    content: entry.content,
    mood: entry.mood,
    affirmation_id: entry.affirmation_id,
    entry_date: entry.entry_date.toISOString().split('T')[0],
    created_at: entry.created_at.toISOString(),
    updated_at: entry.updated_at.toISOString(),
    affirmation_content: entry.affirmation?.content ?? null,
    mood_type: entry.affirmation?.mood_type ?? null,
});
const registerJournalRoutes = (app) => {
    // ── POST /api/journal — create entry ─────────────────────────
    app.post('/api/journal', auth_1.authenticateToken, rateLimiter_1.journalCreateLimiter, validate_1.validateJournalEntry, async (req, res) => {
        try {
            const { content, mood } = req.body;
            const userId = req.user.userId;
            // Pick a random affirmation for the given mood
            const affirmationCount = await prisma_1.prisma.affirmation.count({ where: { mood_type: mood } });
            const skip = affirmationCount > 0 ? Math.floor(Math.random() * affirmationCount) : 0;
            const affirmation = await prisma_1.prisma.affirmation.findFirst({
                where: { mood_type: mood },
                orderBy: { id: 'asc' },
                skip,
            });
            const entry = await prisma_1.prisma.journalEntry.create({
                data: {
                    user_id: userId,
                    content,
                    mood,
                    affirmation_id: affirmation?.id ?? null,
                    entry_date: getMSTDate(),
                },
            });
            res.status(201).json({
                message: 'Journal entry created.',
                entry,
                affirmation: affirmation?.content ?? null,
            });
        }
        catch (err) {
            console.error('[Journal] Create error:', err.message);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
    // ── GET /api/journal — all entries for user ───────────────────
    app.get('/api/journal', auth_1.authenticateToken, rateLimiter_1.readLimiter, async (req, res) => {
        try {
            const entries = await prisma_1.prisma.journalEntry.findMany({
                where: { user_id: req.user.userId },
                include: { affirmation: true },
                orderBy: { entry_date: 'desc' },
            });
            res.status(200).json(entries.map(formatEntry));
        }
        catch (err) {
            console.error('[Journal] Fetch all error:', err.message);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
    // ── GET /api/journal/date/:date — entries by date ─────────────
    // Must be declared BEFORE /api/journal/:id to avoid route collision
    app.get('/api/journal/date/:date', auth_1.authenticateToken, rateLimiter_1.readLimiter, validate_1.validateDateParam, async (req, res) => {
        try {
            const { date } = req.params;
            const startOfDay = new Date(`${date}T00:00:00-07:00`);
            const endOfDay = new Date(`${date}T23:59:59-07:00`);
            const entries = await prisma_1.prisma.journalEntry.findMany({
                where: {
                    user_id: req.user.userId,
                    entry_date: { gte: startOfDay, lte: endOfDay },
                },
                include: { affirmation: true },
                orderBy: { created_at: 'desc' },
            });
            res.status(200).json(entries.map(formatEntry));
        }
        catch (err) {
            console.error('[Journal] Fetch by date error:', err.message);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
    // ── GET /api/journal/:id — single entry ───────────────────────
    app.get('/api/journal/:id', auth_1.authenticateToken, rateLimiter_1.readLimiter, validate_1.validateJournalId, async (req, res) => {
        try {
            const entryId = parseInt(req.params.id, 10);
            const entry = await prisma_1.prisma.journalEntry.findFirst({
                where: { id: entryId, user_id: req.user.userId },
                include: { affirmation: true },
            });
            if (!entry) {
                res.status(404).json({ error: 'Journal entry not found.' });
                return;
            }
            res.status(200).json(formatEntry(entry));
        }
        catch (err) {
            console.error('[Journal] Fetch single error:', err.message);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
};
exports.registerJournalRoutes = registerJournalRoutes;
