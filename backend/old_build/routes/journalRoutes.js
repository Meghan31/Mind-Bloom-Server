"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJournalRoutes = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var prisma_1 = require("../lib/prisma");
// Middleware to verify JWT token
var authenticateToken = function (req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};
var registerJournalRoutes = function (app) {
    console.log('Registering journal routes');
    // Create a new journal entry
    app.post('/api/journal', authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, content, mood, userId, affirmation, entry, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('POST /api/journal received:', req.body);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    _a = req.body, content = _a.content, mood = _a.mood;
                    userId = req.user.userId;
                    // Validate request
                    if (!content || !mood) {
                        return [2 /*return*/, res.status(400).json({ error: 'Content and mood are required' })];
                    }
                    return [4 /*yield*/, prisma_1.prisma.affirmation.findFirst({
                            where: { mood_type: mood },
                            orderBy: { id: 'asc' }, // Using asc for deterministic ordering, for random use a different approach
                            take: 1,
                        })];
                case 2:
                    affirmation = _b.sent();
                    return [4 /*yield*/, prisma_1.prisma.journalEntry.create({
                            data: {
                                user_id: userId,
                                content: content,
                                mood: mood,
                                affirmation_id: (affirmation === null || affirmation === void 0 ? void 0 : affirmation.id) || null,
                                entry_date: new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })),
                            },
                        })];
                case 3:
                    entry = _b.sent();
                    // Return the entry with the affirmation
                    res.status(201).json({
                        message: 'Journal entry created successfully',
                        entry: entry,
                        affirmation: (affirmation === null || affirmation === void 0 ? void 0 : affirmation.content) || null,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error('Journal entry creation error:', error_1);
                    res.status(500).json({ error: 'Internal server error' });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    // Get all journal entries for the logged-in user
    app.get('/api/journal', authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, entries, formattedEntries, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('GET /api/journal received');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = req.user.userId;
                    return [4 /*yield*/, prisma_1.prisma.journalEntry.findMany({
                            where: { user_id: userId },
                            include: {
                                affirmation: true,
                            },
                            orderBy: { entry_date: 'desc' },
                        })];
                case 2:
                    entries = _a.sent();
                    formattedEntries = entries.map(function (entry) {
                        var _a, _b;
                        return ({
                            id: entry.id,
                            user_id: entry.user_id,
                            content: entry.content,
                            mood: entry.mood,
                            affirmation_id: entry.affirmation_id,
                            entry_date: entry.entry_date.toISOString().split('T')[0],
                            created_at: entry.created_at.toISOString(),
                            updated_at: entry.updated_at.toISOString(),
                            affirmation_content: ((_a = entry.affirmation) === null || _a === void 0 ? void 0 : _a.content) || null,
                            mood_type: ((_b = entry.affirmation) === null || _b === void 0 ? void 0 : _b.mood_type) || null,
                        });
                    });
                    console.log("Retrieved ".concat(formattedEntries.length, " entries for user ").concat(userId));
                    res.status(200).json(formattedEntries);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Journal entries fetch error:', error_2);
                    res.status(500).json({ error: 'Internal server error' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Get a specific journal entry by ID
    app.get('/api/journal/:id', authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, entryId, entry, formattedEntry, error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("GET /api/journal/".concat(req.params.id, " received"));
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    userId = req.user.userId;
                    entryId = parseInt(req.params.id);
                    return [4 /*yield*/, prisma_1.prisma.journalEntry.findUnique({
                            where: {
                                id: entryId,
                                user_id: userId,
                            },
                            include: {
                                affirmation: true,
                            },
                        })];
                case 2:
                    entry = _c.sent();
                    if (!entry) {
                        return [2 /*return*/, res.status(404).json({ error: 'Journal entry not found' })];
                    }
                    formattedEntry = {
                        id: entry.id,
                        user_id: entry.user_id,
                        content: entry.content,
                        mood: entry.mood,
                        affirmation_id: entry.affirmation_id,
                        entry_date: entry.entry_date.toISOString().split('T')[0],
                        created_at: entry.created_at.toISOString(),
                        updated_at: entry.updated_at.toISOString(),
                        affirmation_content: ((_a = entry.affirmation) === null || _a === void 0 ? void 0 : _a.content) || null,
                        mood_type: ((_b = entry.affirmation) === null || _b === void 0 ? void 0 : _b.mood_type) || null,
                    };
                    res.status(200).json(formattedEntry);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _c.sent();
                    console.error('Journal entry fetch error:', error_3);
                    res.status(500).json({ error: 'Internal server error' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Get entries by date
    app.get('/api/journal/date/:date', authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, dateString, startDate, endDate, entries, formattedEntries, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("GET /api/journal/date/".concat(req.params.date, " received"));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = req.user.userId;
                    dateString = req.params.date;
                    startDate = new Date(dateString + 'T00:00:00-06:00');
                    endDate = new Date(dateString + 'T23:59:59-06:00');
                    return [4 /*yield*/, prisma_1.prisma.journalEntry.findMany({
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
                        })];
                case 2:
                    entries = _a.sent();
                    formattedEntries = entries.map(function (entry) {
                        var _a, _b;
                        return ({
                            id: entry.id,
                            user_id: entry.user_id,
                            content: entry.content,
                            mood: entry.mood,
                            affirmation_id: entry.affirmation_id,
                            entry_date: entry.entry_date.toISOString().split('T')[0],
                            created_at: entry.created_at.toISOString(),
                            updated_at: entry.updated_at.toISOString(),
                            affirmation_content: ((_a = entry.affirmation) === null || _a === void 0 ? void 0 : _a.content) || null,
                            mood_type: ((_b = entry.affirmation) === null || _b === void 0 ? void 0 : _b.mood_type) || null,
                        });
                    });
                    console.log("Retrieved ".concat(formattedEntries.length, " entries for date ").concat(dateString));
                    res.status(200).json(formattedEntries);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('Journal entries by date fetch error:', error_4);
                    res.status(500).json({ error: 'Internal server error' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
};
exports.registerJournalRoutes = registerJournalRoutes;
