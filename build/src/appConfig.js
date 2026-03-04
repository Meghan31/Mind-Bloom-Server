"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = void 0;
// src/appConfig.ts
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const handleIndex_1 = require("./handleIndex");
const prisma_1 = require("./lib/prisma");
const rateLimiter_1 = require("./middleware/rateLimiter");
const affirmationRoutes_1 = require("./routes/affirmationRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const journalRoutes_1 = require("./routes/journalRoutes");
const staticFileHandler_1 = require("./webSupport/staticFileHandler");
const IS_PROD = process.env.NODE_ENV === 'production';
// Set ALLOWED_ORIGINS in .env as a comma-separated list of frontend URLs.
// e.g. ALLOWED_ORIGINS=https://mind-bloom.vercel.app,https://my-custom-domain.com
const getAllowedOrigins = () => {
    const envOrigins = process.env.ALLOWED_ORIGINS;
    if (envOrigins) {
        return envOrigins
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean);
    }
    return [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
    ];
};
const configureApp = (_environment) => (app) => {
    // ── Trust proxy (required for accurate IP with Vercel / nginx) ──
    app.set('trust proxy', 1);
    // ── CORS — must be first, before every other middleware ───────
    // Handles preflight OPTIONS before helmet / rate-limiter can
    // swallow the request during a Vercel cold-start.
    const allowedOrigins = getAllowedOrigins();
    const corsOptions = {
        origin: (origin, callback) => {
            // Allow requests without Origin header (curl, Postman, health checks)
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin))
                return callback(null, true);
            callback(new Error(`CORS_BLOCKED:${origin}`));
        },
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204,
    };
    // Respond to all preflight requests immediately — before any other middleware
    app.options('*', (0, cors_1.default)(corsOptions));
    app.use((0, cors_1.default)(corsOptions));
    // ── Security headers ─────────────────────────────────────────
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false, // API server — no strict CSP needed
        crossOriginEmbedderPolicy: false,
    }));
    // ── Body parsing — hard cap at 50 KB ─────────────────────────
    app.use(express_1.default.json({ limit: '50kb' }));
    app.use(express_1.default.urlencoded({ extended: false, limit: '50kb' }));
    // ── Global rate limiter — skip OPTIONS (already handled above) ─
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS')
            return next();
        return (0, rateLimiter_1.globalLimiter)(req, res, next);
    });
    // ── Non-sensitive request logger ──────────────────────────────
    app.use((req, _res, next) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
        next();
    });
    // ── Static / template pages ───────────────────────────────────
    handleIndex_1.index.registerHandler(app);
    // ── Health check (no auth, no info leak) ─────────────────────
    app.get('/health', async (_req, res) => {
        try {
            await prisma_1.prisma.$queryRaw `SELECT 1 as ok`;
            res.json({ status: 'UP' });
        }
        catch {
            res.status(503).json({ status: 'DOWN' });
        }
    });
    // ── API routes ───────────────────────────────────────────────
    (0, authRoutes_1.registerAuthRoutes)(app);
    (0, journalRoutes_1.registerJournalRoutes)(app);
    (0, affirmationRoutes_1.registerAffirmationRoutes)(app);
    // ── Test routes — development only ───────────────────────────
    if (!IS_PROD) {
        app.get('/api/test', (_req, res) => res.json({ ok: true }));
    }
    // ── Static files ─────────────────────────────────────────────
    staticFileHandler_1.staticFileHandler.registerHandler(app);
    // ── 404 ──────────────────────────────────────────────────────
    app.use((_req, res) => {
        res.status(404).json({ error: 'Not found.' });
    });
    // ── Global error handler ──────────────────────────────────────
    app.use((err, _req, res, _next) => {
        const msg = err?.message ?? String(err);
        // CORS violations
        if (msg.startsWith('CORS_BLOCKED')) {
            res.status(403).json({ error: 'Forbidden.' });
            return;
        }
        console.error('[Error]', msg);
        // Never leak internals in production
        res.status(500).json({
            error: 'Internal server error.',
            ...(IS_PROD ? {} : { detail: msg }),
        });
    });
};
exports.configureApp = configureApp;
