// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

const json429 = (msg: string) =>
	(_req: any, res: any) => res.status(429).json({ error: msg });

// ── Global: 300 requests per 15 min per IP ──────────────────
export const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 300,
	standardHeaders: true,
	legacyHeaders: false,
	handler: json429('Too many requests. Please slow down.'),
});

// ── Auth endpoints: 10 requests per 15 min per IP ───────────
// Protects against brute-force login / register spam
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: false,
	handler: json429('Too many attempts. Please wait 15 minutes and try again.'),
});

// ── Affirmation (today): 10 per day per IP ──────────────────
// Prevents OpenAI / DB abuse; matches user requirement
export const affirmationTodayLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	handler: json429("You've reached your daily affirmation limit. Come back tomorrow!"),
});

// ── Journal creation: 30 per hour per IP ────────────────────
export const journalCreateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	handler: json429('Too many journal entries. Please wait before writing more.'),
});

// ── General read endpoints: 100 per 15 min per IP ───────────
export const readLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	handler: json429('Too many requests. Please slow down.'),
});
