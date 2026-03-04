// src/middleware/validate.ts
import { NextFunction, Request, Response } from 'express';

const VALID_MOODS = [
	'Happy', 'Relaxed', 'Confident', 'Calm', 'Content',
	'Reflective', 'Sad', 'Anxious', 'Frustrated',
	'Bittersweet', 'Nostalgic', 'Conflicted',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/;

// ── Auth ─────────────────────────────────────────────────────

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
	const { username, email, password } = req.body;

	if (
		!username ||
		typeof username !== 'string' ||
		username.trim().length < 2 ||
		username.trim().length > 50
	) {
		res.status(400).json({ error: 'Username must be 2–50 characters.' });
		return;
	}

	if (!email || !EMAIL_RE.test(String(email).toLowerCase())) {
		res.status(400).json({ error: 'A valid email address is required.' });
		return;
	}

	if (!password || typeof password !== 'string' || password.length < 8 || password.length > 128) {
		res.status(400).json({ error: 'Password must be 8–128 characters.' });
		return;
	}

	// Sanitise
	req.body.username = username.trim();
	req.body.email    = String(email).trim().toLowerCase();
	next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
	const { email, password } = req.body;

	if (!email || !EMAIL_RE.test(String(email).toLowerCase())) {
		res.status(400).json({ error: 'A valid email address is required.' });
		return;
	}

	if (!password || typeof password !== 'string' || password.length > 128) {
		res.status(400).json({ error: 'Password is required.' });
		return;
	}

	req.body.email = String(email).trim().toLowerCase();
	next();
};

// ── Journal ──────────────────────────────────────────────────

export const validateJournalEntry = (req: Request, res: Response, next: NextFunction): void => {
	const { content, mood } = req.body;

	if (
		!content ||
		typeof content !== 'string' ||
		content.trim().length < 1 ||
		content.trim().length > 5000
	) {
		res.status(400).json({ error: 'Content must be 1–5000 characters.' });
		return;
	}

	if (!mood || !VALID_MOODS.includes(mood)) {
		res.status(400).json({ error: `Mood must be one of: ${VALID_MOODS.join(', ')}.` });
		return;
	}

	req.body.content = content.trim();
	next();
};

export const validateDateParam = (req: Request, res: Response, next: NextFunction): void => {
	const { date } = req.params;

	if (!date || !DATE_RE.test(date)) {
		res.status(400).json({ error: 'Date must be in YYYY-MM-DD format.' });
		return;
	}

	const d = new Date(date);
	if (isNaN(d.getTime())) {
		res.status(400).json({ error: 'Invalid date.' });
		return;
	}

	// Reject dates more than 10 years in the past or any future date
	const now = new Date();
	const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
	if (d < tenYearsAgo || d > now) {
		res.status(400).json({ error: 'Date is out of valid range.' });
		return;
	}

	next();
};

export const validateMoodQuery = (req: Request, res: Response, next: NextFunction): void => {
	const mood = req.query.mood as string | undefined;
	if (mood && !VALID_MOODS.includes(mood)) {
		res.status(400).json({ error: 'Invalid mood type.' });
		return;
	}
	next();
};

export const validateMoodParam = (req: Request, res: Response, next: NextFunction): void => {
	const { mood } = req.params;
	if (!VALID_MOODS.includes(mood)) {
		res.status(400).json({ error: 'Invalid mood type.' });
		return;
	}
	next();
};

export const validateJournalId = (req: Request, res: Response, next: NextFunction): void => {
	const id = parseInt(req.params.id, 10);
	if (!Number.isInteger(id) || id <= 0) {
		res.status(400).json({ error: 'Invalid journal entry ID.' });
		return;
	}
	next();
};
