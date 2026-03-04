"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readLimiter = exports.journalCreateLimiter = exports.affirmationTodayLimiter = exports.authLimiter = exports.globalLimiter = void 0;
// src/middleware/rateLimiter.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const json429 = (msg) => (_req, res) => res.status(429).json({ error: msg });
// ── Global: 300 requests per 15 min per IP ──────────────────
exports.globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: json429('Too many requests. Please slow down.'),
});
// ── Auth endpoints: 10 requests per 15 min per IP ───────────
// Protects against brute-force login / register spam
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: json429('Too many attempts. Please wait 15 minutes and try again.'),
});
// ── Affirmation (today): 10 per day per IP ──────────────────
// Prevents OpenAI / DB abuse; matches user requirement
exports.affirmationTodayLimiter = (0, express_rate_limit_1.default)({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: json429("You've reached your daily affirmation limit. Come back tomorrow!"),
});
// ── Journal creation: 30 per hour per IP ────────────────────
exports.journalCreateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    handler: json429('Too many journal entries. Please wait before writing more.'),
});
// ── General read endpoints: 100 per 15 min per IP ───────────
exports.readLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: json429('Too many requests. Please slow down.'),
});
