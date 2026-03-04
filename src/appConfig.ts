// src/appConfig.ts
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { Environment } from './environment';
import { index } from './handleIndex';
import { prisma } from './lib/prisma';
import { globalLimiter } from './middleware/rateLimiter';
import { registerAffirmationRoutes } from './routes/affirmationRoutes';
import { registerAuthRoutes } from './routes/authRoutes';
import { registerJournalRoutes } from './routes/journalRoutes';
import { staticFileHandler } from './webSupport/staticFileHandler';

const IS_PROD = process.env.NODE_ENV === 'production';

// Set ALLOWED_ORIGINS in .env as a comma-separated list of frontend URLs.
// e.g. ALLOWED_ORIGINS=https://mind-bloom.vercel.app,https://my-custom-domain.com
const getAllowedOrigins = (): string[] => {
	const envOrigins = process.env.ALLOWED_ORIGINS;
	if (envOrigins) {
		return envOrigins.split(',').map((o) => o.trim()).filter(Boolean);
	}
	return ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
};

export const configureApp = (_environment: Environment) => (app: Express) => {
	// ── Trust proxy (required for accurate IP with Vercel / nginx) ──
	app.set('trust proxy', 1);

	// ── Security headers ─────────────────────────────────────────
	app.use(
		helmet({
			contentSecurityPolicy: false,      // API server — no strict CSP needed
			crossOriginEmbedderPolicy: false,
		})
	);

	// ── CORS — restrict to known frontend origins ─────────────────
	const allowedOrigins = getAllowedOrigins();
	app.use(
		cors({
			origin: (origin, callback) => {
				// Allow requests without Origin header (curl, Postman, health checks)
				if (!origin) return callback(null, true);
				if (allowedOrigins.includes(origin)) return callback(null, true);
				callback(new Error(`CORS_BLOCKED:${origin}`));
			},
			methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
			optionsSuccessStatus: 204,
		})
	);

	// ── Body parsing — hard cap at 50 KB ─────────────────────────
	app.use(express.json({ limit: '50kb' }));
	app.use(express.urlencoded({ extended: false, limit: '50kb' }));

	// ── Global rate limiter ───────────────────────────────────────
	app.use(globalLimiter);

	// ── Non-sensitive request logger ──────────────────────────────
	app.use((req: Request, _res: Response, next: NextFunction) => {
		console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
		next();
	});

	// ── Static / template pages ───────────────────────────────────
	index.registerHandler(app);

	// ── Health check (no auth, no info leak) ─────────────────────
	app.get('/health', async (_req, res) => {
		try {
			await prisma.$queryRaw`SELECT 1 as ok`;
			res.json({ status: 'UP' });
		} catch {
			res.status(503).json({ status: 'DOWN' });
		}
	});

	// ── API routes ───────────────────────────────────────────────
	registerAuthRoutes(app);
	registerJournalRoutes(app);
	registerAffirmationRoutes(app);

	// ── Test routes — development only ───────────────────────────
	if (!IS_PROD) {
		app.get('/api/test', (_req, res) => res.json({ ok: true }));
	}

	// ── Static files ─────────────────────────────────────────────
	staticFileHandler.registerHandler(app);

	// ── 404 ──────────────────────────────────────────────────────
	app.use((_req: Request, res: Response) => {
		res.status(404).json({ error: 'Not found.' });
	});

	// ── Global error handler ──────────────────────────────────────
	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		const msg: string = err?.message ?? String(err);

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

	console.log(`[Config] Origins allowed: ${allowedOrigins.join(', ')}`);
};
