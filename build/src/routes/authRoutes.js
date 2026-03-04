"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthRoutes = void 0;
// src/routes/authRoutes.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const validate_1 = require("../middleware/validate");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = (process.env.JWT_EXPIRATION ?? '24h');
// Constant-time dummy hash — used when user is not found so bcrypt.compare
// always runs, preventing user-enumeration via response timing.
const DUMMY_HASH = '$2b$12$invalidhashusedtopreventinenumeration.xxxxxxxxxxxxxx';
const registerAuthRoutes = (app) => {
    // ── POST /api/auth/register ───────────────────────────────────
    app.post('/api/auth/register', rateLimiter_1.authLimiter, validate_1.validateRegister, async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (existing) {
                // Generic message — never confirm whether an email exists
                res.status(400).json({ error: 'Registration failed. Please check your details.' });
                return;
            }
            const passwordHash = await bcrypt_1.default.hash(password, 12);
            await prisma_1.prisma.user.create({
                data: { username, email, password_hash: passwordHash },
            });
            res.status(201).json({ message: 'Account created successfully.' });
        }
        catch (err) {
            console.error('[Auth] Register error:', err.message);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
    // ── POST /api/auth/login ──────────────────────────────────────
    app.post('/api/auth/login', rateLimiter_1.authLimiter, validate_1.validateLogin, async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await prisma_1.prisma.user.findUnique({ where: { email } });
            // Always run bcrypt to avoid timing-based user enumeration
            const hashToCheck = user?.password_hash ?? DUMMY_HASH;
            const match = await bcrypt_1.default.compare(password, hashToCheck);
            if (!user || !match) {
                res.status(401).json({ error: 'Invalid credentials.' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
            res.status(200).json({
                message: 'Login successful.',
                token,
                user: { id: user.id, username: user.username, email: user.email },
            });
        }
        catch (err) {
            console.error('[Auth] Login error:', err.message);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });
    // ── GET /api/auth/verify ──────────────────────────────────────
    app.get('/api/auth/verify', auth_1.authenticateToken, async (req, res) => {
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: req.user.userId },
                select: { id: true, username: true, email: true },
            });
            if (!user) {
                res.status(401).json({ valid: false, error: 'User not found.' });
                return;
            }
            res.json({ valid: true, user });
        }
        catch (err) {
            console.error('[Auth] Verify error:', err.message);
            res.status(500).json({ valid: false, error: 'Internal server error.' });
        }
    });
};
exports.registerAuthRoutes = registerAuthRoutes;
