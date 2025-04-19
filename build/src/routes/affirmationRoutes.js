"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAffirmationRoutes = void 0;
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
const registerAffirmationRoutes = (app) => {
    // Get today's affirmation for a specific mood
    app.get('/api/affirmation/today', authenticateToken, async (req, res) => {
        try {
            // Get mood from query params, default to Reflective
            const mood = req.query.mood || 'Reflective';
            // Get a random affirmation based on mood
            const affirmations = await prisma_1.prisma.affirmation.findMany({
                where: {
                    mood_type: mood,
                },
                orderBy: {
                    id: 'asc', // For deterministic ordering, replace with something more random if needed
                },
                take: 1,
            });
            if (affirmations.length === 0) {
                // If no affirmation for specific mood, try to get a fallback
                const fallbackAffirmations = await prisma_1.prisma.affirmation.findMany({
                    where: {
                        mood_type: 'Reflective',
                    },
                    orderBy: {
                        id: 'asc',
                    },
                    take: 1,
                });
                if (fallbackAffirmations.length === 0) {
                    return res.status(404).json({ error: 'No affirmations found' });
                }
                return res.status(200).json(fallbackAffirmations[0]);
            }
            res.status(200).json(affirmations[0]);
        }
        catch (error) {
            console.error('Affirmation fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Get all affirmations for a specific mood
    app.get('/api/affirmations/:mood', authenticateToken, async (req, res) => {
        try {
            const mood = req.params.mood;
            // Get all affirmations for the mood
            const affirmations = await prisma_1.prisma.affirmation.findMany({
                where: {
                    mood_type: mood,
                },
            });
            if (affirmations.length === 0) {
                return res
                    .status(404)
                    .json({ error: 'No affirmations found for the specified mood' });
            }
            res.status(200).json(affirmations);
        }
        catch (error) {
            console.error('Affirmations fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.registerAffirmationRoutes = registerAffirmationRoutes;
