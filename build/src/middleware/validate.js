"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJournalId = exports.validateMoodParam = exports.validateMoodQuery = exports.validateDateParam = exports.validateJournalEntry = exports.validateLogin = exports.validateRegister = void 0;
const VALID_MOODS = [
    'Happy', 'Relaxed', 'Confident', 'Calm', 'Content',
    'Reflective', 'Sad', 'Anxious', 'Frustrated',
    'Bittersweet', 'Nostalgic', 'Conflicted',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// ── Auth ─────────────────────────────────────────────────────
const validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username ||
        typeof username !== 'string' ||
        username.trim().length < 2 ||
        username.trim().length > 50) {
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
    req.body.email = String(email).trim().toLowerCase();
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
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
exports.validateLogin = validateLogin;
// ── Journal ──────────────────────────────────────────────────
const validateJournalEntry = (req, res, next) => {
    const { content, mood } = req.body;
    if (!content ||
        typeof content !== 'string' ||
        content.trim().length < 1 ||
        content.trim().length > 5000) {
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
exports.validateJournalEntry = validateJournalEntry;
const validateDateParam = (req, res, next) => {
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
exports.validateDateParam = validateDateParam;
const validateMoodQuery = (req, res, next) => {
    const mood = req.query.mood;
    if (mood && !VALID_MOODS.includes(mood)) {
        res.status(400).json({ error: 'Invalid mood type.' });
        return;
    }
    next();
};
exports.validateMoodQuery = validateMoodQuery;
const validateMoodParam = (req, res, next) => {
    const { mood } = req.params;
    if (!VALID_MOODS.includes(mood)) {
        res.status(400).json({ error: 'Invalid mood type.' });
        return;
    }
    next();
};
exports.validateMoodParam = validateMoodParam;
const validateJournalId = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid journal entry ID.' });
        return;
    }
    next();
};
exports.validateJournalId = validateJournalId;
