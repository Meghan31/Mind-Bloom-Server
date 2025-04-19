"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// src/analyze.ts
var axios_1 = __importDefault(require("axios"));
require("dotenv/config");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var prisma_1 = require("./lib/prisma");
// Configuration
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
var QUOTES_FILE = path_1.default.join(__dirname, '../data/collected_quotes.json');
// Available moods in the system
var AVAILABLE_MOODS = [
    'Happy',
    'Relaxed',
    'Confident',
    'Calm',
    'Content',
    'Reflective',
    'Sad',
    'Anxious',
    'Frustrated',
    'Bittersweet',
    'Nostalgic',
    'Conflicted',
];
// OpenAI API client
var openai = axios_1.default.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        Authorization: "Bearer ".concat(OPENAI_API_KEY),
        'Content-Type': 'application/json',
    },
});
// Function to get quotes that haven't been analyzed
function getUnanalyzedQuotes() {
    if (!fs_1.default.existsSync(QUOTES_FILE)) {
        console.error('Quotes file not found');
        return [];
    }
    try {
        var quotesData = fs_1.default.readFileSync(QUOTES_FILE, 'utf8');
        var quotes = JSON.parse(quotesData);
        return quotes.filter(function (q) { return q && !q.analyzed; });
    }
    catch (error) {
        console.error('Error reading quotes file:', error);
        return [];
    }
}
// Function to determine the mood of a quote using OpenAI
function analyzeMood(quote) {
    return __awaiter(this, void 0, void 0, function () {
        var response, mood_1, normalizedMood, error_1;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 2, , 3]);
                    console.log('Analyzing mood for quote:', quote);
                    return [4 /*yield*/, openai.post('/chat/completions', {
                            model: 'gpt-3.5-turbo', // Using a more widely available model
                            messages: [
                                {
                                    role: 'system',
                                    content: "You are a helpful assistant that analyzes the mood of quotes. Available moods are: ".concat(AVAILABLE_MOODS.join(', '), "."),
                                },
                                {
                                    role: 'user',
                                    content: "Analyze this quote: \"".concat(quote, "\"\n\nWhich of these moods does this quote best align with? Available moods: ").concat(AVAILABLE_MOODS.join(', '), "\n\nRespond with just the mood name, nothing else."),
                                },
                            ],
                            temperature: 0.2,
                            max_tokens: 20,
                        })];
                case 1:
                    response = _f.sent();
                    // Check if response has the expected structure
                    if ((_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) {
                        mood_1 = response.data.choices[0].message.content.trim();
                        normalizedMood = AVAILABLE_MOODS.find(function (m) { return m.toLowerCase() === mood_1.toLowerCase(); });
                        if (!normalizedMood) {
                            console.warn("OpenAI returned invalid mood: ".concat(mood_1, ". Using default mood: Reflective"));
                            return [2 /*return*/, 'Reflective']; // Default if we get an invalid mood
                        }
                        console.log('Determined mood:', normalizedMood);
                        return [2 /*return*/, normalizedMood];
                    }
                    else {
                        console.warn('Unexpected response format from OpenAI');
                        return [2 /*return*/, 'Reflective']; // Default in case of unexpected response
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _f.sent();
                    if (axios_1.default.isAxiosError(error_1)) {
                        console.error('Error analyzing mood:', ((_e = error_1.response) === null || _e === void 0 ? void 0 : _e.data) || error_1.message);
                    }
                    else {
                        console.error('Error analyzing mood:', error_1);
                    }
                    return [2 /*return*/, 'Reflective']; // Default in case of error
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to save the quote to the database
function saveQuoteToDatabase(quote, mood) {
    return __awaiter(this, void 0, void 0, function () {
        var affirmation, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Saving quote to database with mood: ".concat(mood));
                    return [4 /*yield*/, prisma_1.prisma.affirmation.create({
                            data: {
                                content: quote,
                                mood_type: mood,
                            },
                        })];
                case 1:
                    affirmation = _a.sent();
                    console.log('Quote saved to database with ID:', affirmation.id);
                    return [2 /*return*/, affirmation];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error saving quote to database:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to update the quotes file to mark a quote as analyzed
function markQuoteAsAnalyzed(quoteText) {
    try {
        var quotesData = fs_1.default.readFileSync(QUOTES_FILE, 'utf8');
        var quotes = JSON.parse(quotesData);
        var updatedQuotes = quotes.map(function (q) {
            if (q.quote === quoteText && !q.analyzed) {
                return __assign(__assign({}, q), { analyzed: true, analyzed_at: new Date().toISOString() });
            }
            return q;
        });
        fs_1.default.writeFileSync(QUOTES_FILE, JSON.stringify(updatedQuotes, null, 2));
        console.log('Quote marked as analyzed in file');
    }
    catch (error) {
        console.error('Error marking quote as analyzed:', error);
    }
}
// Main function
function analyzeQuotes() {
    return __awaiter(this, void 0, void 0, function () {
        var unanalyzedQuotes, quoteToAnalyze, mood, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 6]);
                    console.log('Starting quote analysis process...');
                    if (!OPENAI_API_KEY) {
                        throw new Error('OPENAI_API_KEY environment variable is not set');
                    }
                    unanalyzedQuotes = getUnanalyzedQuotes();
                    console.log("Found ".concat(unanalyzedQuotes.length, " unanalyzed quotes"));
                    if (unanalyzedQuotes.length === 0) {
                        console.log('No quotes to analyze');
                        return [2 /*return*/];
                    }
                    quoteToAnalyze = unanalyzedQuotes[0];
                    if (!quoteToAnalyze || !quoteToAnalyze.quote) {
                        throw new Error('Invalid quote data in file');
                    }
                    return [4 /*yield*/, analyzeMood(quoteToAnalyze.quote)];
                case 1:
                    mood = _a.sent();
                    // Save to database
                    return [4 /*yield*/, saveQuoteToDatabase(quoteToAnalyze.quote, mood)];
                case 2:
                    // Save to database
                    _a.sent();
                    // Mark as analyzed
                    markQuoteAsAnalyzed(quoteToAnalyze.quote);
                    console.log('Quote analysis completed successfully');
                    return [3 /*break*/, 6];
                case 3:
                    error_3 = _a.sent();
                    console.error('Quote analysis failed:', error_3);
                    process.exit(1);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, prisma_1.prisma.$disconnect()];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Run the analysis process
analyzeQuotes();
