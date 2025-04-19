"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJournalRoutes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};
const registerJournalRoutes = (app) => {
    console.log('Registering journal routes');
    // Create a new journal entry
    app.post('/api/journal', authenticateToken, async (req, res) => {
        console.log('POST /api/journal received:', req.body);
        try {
            const { content, mood } = req.body;
            const userId = req.user.userId;
            // Validate request
            if (!content || !mood) {
                return res.status(400).json({ error: 'Content and mood are required' });
            }
            // Get a random affirmation based on mood
            const affirmation = await prisma_1.prisma.affirmation.findFirst({
                where: { mood_type: mood },
                orderBy: { id: 'asc' }, // Using asc for deterministic ordering, for random use a different approach
                take: 1,
            });
            // Insert journal entry
            const entry = await prisma_1.prisma.journalEntry.create({
                data: {
                    user_id: userId,
                    content,
                    mood,
                    affirmation_id: affirmation?.id || null,
                    entry_date: new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })),
                },
            });
            // Return the entry with the affirmation
            res.status(201).json({
                message: 'Journal entry created successfully',
                entry,
                affirmation: affirmation?.content || null,
            });
        }
        catch (error) {
            console.error('Journal entry creation error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Get all journal entries for the logged-in user
    app.get('/api/journal', authenticateToken, async (req, res) => {
        console.log('GET /api/journal received');
        try {
            const userId = req.user.userId;
            // Get all entries for the user with affirmations
            const entries = await prisma_1.prisma.journalEntry.findMany({
                where: { user_id: userId },
                include: {
                    affirmation: true,
                },
                orderBy: { entry_date: 'desc' },
            });
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
            console.log(`Retrieved ${formattedEntries.length} entries for user ${userId}`);
            res.status(200).json(formattedEntries);
        }
        catch (error) {
            console.error('Journal entries fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Get a specific journal entry by ID
    app.get('/api/journal/:id', authenticateToken, async (req, res) => {
        console.log(`GET /api/journal/${req.params.id} received`);
        try {
            const userId = req.user.userId;
            const entryId = parseInt(req.params.id);
            // Get the entry with affirmation
            const entry = await prisma_1.prisma.journalEntry.findUnique({
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
        }
        catch (error) {
            console.error('Journal entry fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Get entries by date
    app.get('/api/journal/date/:date', authenticateToken, async (req, res) => {
        console.log(`GET /api/journal/date/${req.params.date} received`);
        try {
            const userId = req.user.userId;
            const dateString = req.params.date; // Format: YYYY-MM-DD
            // Create Date objects for the start and end of the day
            const startDate = new Date(dateString + 'T00:00:00-06:00'); // -06:00 is MST
            const endDate = new Date(dateString + 'T23:59:59-06:00'); // Set to next day
            // Get entries for the specified date
            const entries = await prisma_1.prisma.journalEntry.findMany({
                where: {
                    user_id: userId,
                    entry_date: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                include: {
                    affirmation: true,
                },
                orderBy: { created_at: 'desc' },
            });
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
            console.log(`Retrieved ${formattedEntries.length} entries for date ${dateString}`);
            res.status(200).json(formattedEntries);
        }
        catch (error) {
            console.error('Journal entries by date fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.registerJournalRoutes = registerJournalRoutes;
