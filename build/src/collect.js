"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/collect.ts
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const MOODS = [
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
const newMood = MOODS[Math.floor(Math.random() * MOODS.length)];
// console.log('Mood:', newMood);
// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QUOTES_FILE = path_1.default.join(__dirname, '../data/collected_quotes.json');
// Ensure the data directory exists
const ensureDataDir = () => {
    try {
        const dataDir = path_1.default.join(__dirname, '../data');
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
const openai = axios_1.default.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
    },
});
// Function to get a quote from OpenAI
async function getQuoteFromOpenAI() {
    try {
        console.log('Requesting quote from OpenAI... ');
        // console.log('Requesting quote from OpenAI... with random mood:', newMood);
        const response = await openai.post('/chat/completions', {
            model: 'gpt-3.5-turbo', // Using a more widely available model
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates inspirational and uplifting quotes.',
                },
                {
                    role: 'user',
                    content: `Generate a short, authentic quote (1 sentence, <8 words)
      that embodies
    ${newMood}
      mood.
      Make it positive and non-cliché. Only include the quote text, and don't start the quote with embrace, be, or live., make a unique quote.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });
        // Check if response has the expected structure
        if (response.data?.choices?.[0]?.message?.content) {
            const quote = response.data.choices[0].message.content.trim();
            console.log('Received quote:', quote);
            return quote;
        }
        else {
            throw new Error('Unexpected response format from OpenAI');
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Error getting quote from OpenAI:', error.response?.data || error.message);
        }
        else {
            console.error('Error getting quote from OpenAI:', error);
        }
        throw error;
    }
}
// Function to save a quote to the file
function saveQuote(quote) {
    try {
        // Read existing quotes
        const quotesData = fs_1.default.readFileSync(QUOTES_FILE, 'utf8');
        let quotes = [];
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
            quote,
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
async function collectQuote() {
    try {
        console.log('Starting quote collection process...');
        if (!OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is not set');
        }
        if (!ensureDataDir()) {
            throw new Error('Failed to set up data directory');
        }
        const quote = await getQuoteFromOpenAI();
        saveQuote(quote);
        console.log('Quote collection completed successfully');
    }
    catch (error) {
        console.error('Quote collection failed:', error);
        process.exit(1);
    }
}
// Run the collection process
collectQuote();
