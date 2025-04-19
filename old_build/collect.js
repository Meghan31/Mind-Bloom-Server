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
// src/collect.ts
var axios_1 = __importDefault(require("axios"));
require("dotenv/config");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var MOODS = [
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
var newMood = MOODS[Math.floor(Math.random() * MOODS.length)];
// console.log('Mood:', newMood);
// Configuration
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
var QUOTES_FILE = path_1.default.join(__dirname, '../data/collected_quotes.json');
// Ensure the data directory exists
var ensureDataDir = function () {
    try {
        var dataDir = path_1.default.join(__dirname, '../data');
        if (!fs_1.default.existsSync(dataDir)) {
            fs_1.default.mkdirSync(dataDir, { recursive: true });
            console.log('Created data directory');
        }
        // Initialize quotes file if it doesn't exist
        if (!fs_1.default.existsSync(QUOTES_FILE)) {
            fs_1.default.writeFileSync(QUOTES_FILE, JSON.stringify([]));
            console.log('Initialized quotes file');
        }
        return true;
    }
    catch (error) {
        console.error('Error setting up data directory:', error);
        return false;
    }
};
// OpenAI API client
var openai = axios_1.default.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        Authorization: "Bearer ".concat(OPENAI_API_KEY),
        'Content-Type': 'application/json',
    },
});
// Function to get a quote from OpenAI
function getQuoteFromOpenAI() {
    return __awaiter(this, void 0, void 0, function () {
        var response, quote, error_1;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 2, , 3]);
                    console.log('Requesting quote from OpenAI... ');
                    return [4 /*yield*/, openai.post('/chat/completions', {
                            model: 'gpt-3.5-turbo', // Using a more widely available model
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are a helpful assistant that generates inspirational and uplifting quotes.',
                                },
                                {
                                    role: 'user',
                                    content: "Generate a short, authentic quote (1 sentence, <8 words)\n      that embodies\n    ".concat(newMood, "\n      mood.\n      Make it positive and non-clich\u00E9. Only include the quote text, and don't start the quote with embrace, be, or live., make a unique quote."),
                                },
                            ],
                            temperature: 0.7,
                            max_tokens: 100,
                        })];
                case 1:
                    response = _f.sent();
                    // Check if response has the expected structure
                    if ((_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) {
                        quote = response.data.choices[0].message.content.trim();
                        console.log('Received quote:', quote);
                        return [2 /*return*/, quote];
                    }
                    else {
                        throw new Error('Unexpected response format from OpenAI');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _f.sent();
                    if (axios_1.default.isAxiosError(error_1)) {
                        console.error('Error getting quote from OpenAI:', ((_e = error_1.response) === null || _e === void 0 ? void 0 : _e.data) || error_1.message);
                    }
                    else {
                        console.error('Error getting quote from OpenAI:', error_1);
                    }
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to save a quote to the file
function saveQuote(quote) {
    try {
        // Read existing quotes
        var quotesData = fs_1.default.readFileSync(QUOTES_FILE, 'utf8');
        var quotes = [];
        try {
            quotes = JSON.parse(quotesData);
            // Ensure quotes is an array
            if (!Array.isArray(quotes)) {
                quotes = [];
                console.warn('Quotes file did not contain an array, initializing new array');
            }
        }
        catch (e) {
            console.warn('Error parsing quotes file, initializing new array');
        }
        // Add new quote with timestamp
        quotes.push({
            quote: quote,
            collected_at: new Date().toISOString(),
            analyzed: false,
        });
        // Write back to file
        fs_1.default.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2));
        console.log('Quote saved successfully');
    }
    catch (error) {
        console.error('Error saving quote:', error);
        throw error;
    }
}
// Main function
function collectQuote() {
    return __awaiter(this, void 0, void 0, function () {
        var quote, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Starting quote collection process...');
                    if (!OPENAI_API_KEY) {
                        throw new Error('OPENAI_API_KEY environment variable is not set');
                    }
                    if (!ensureDataDir()) {
                        throw new Error('Failed to set up data directory');
                    }
                    return [4 /*yield*/, getQuoteFromOpenAI()];
                case 1:
                    quote = _a.sent();
                    saveQuote(quote);
                    console.log('Quote collection completed successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Quote collection failed:', error_2);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Run the collection process
collectQuote();
