// src/analyze.ts
import axios from 'axios';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { prisma } from './lib/prisma';

// Define types for our quotes
interface QuoteData {
	quote: string;
	collected_at: string;
	analyzed: boolean;
	analyzed_at?: string;
}

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QUOTES_FILE = path.join(__dirname, '../data/collected_quotes.json');

// Available moods in the system
const AVAILABLE_MOODS = [
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
const openai = axios.create({
	baseURL: 'https://api.openai.com/v1',
	headers: {
		Authorization: `Bearer ${OPENAI_API_KEY}`,
		'Content-Type': 'application/json',
	},
});

// Function to get quotes that haven't been analyzed
function getUnanalyzedQuotes(): QuoteData[] {
	if (!fs.existsSync(QUOTES_FILE)) {
		console.error('Quotes file not found');
		return [];
	}

	try {
		const quotesData = fs.readFileSync(QUOTES_FILE, 'utf8');
		const quotes: QuoteData[] = JSON.parse(quotesData);
		return quotes.filter((q) => q && !q.analyzed);
	} catch (error) {
		console.error('Error reading quotes file:', error);
		return [];
	}
}

// Function to determine the mood of a quote using OpenAI
async function analyzeMood(quote: string): Promise<string> {
	try {
		console.log('Analyzing mood for quote:', quote);

		const response = await openai.post('/chat/completions', {
			model: 'gpt-3.5-turbo', // Using a more widely available model
			messages: [
				{
					role: 'system',
					content: `You are a helpful assistant that analyzes the mood of quotes. Available moods are: ${AVAILABLE_MOODS.join(
						', '
					)}.`,
				},
				{
					role: 'user',
					content: `Analyze this quote: "${quote}"\n\nWhich of these moods does this quote best align with? Available moods: ${AVAILABLE_MOODS.join(
						', '
					)}\n\nRespond with just the mood name, nothing else.`,
				},
			],
			temperature: 0.2,
			max_tokens: 20,
		});

		// Check if response has the expected structure
		if (response.data?.choices?.[0]?.message?.content) {
			const mood = response.data.choices[0].message.content.trim();

			// Validate that returned mood is in our available moods list
			const normalizedMood = AVAILABLE_MOODS.find(
				(m) => m.toLowerCase() === mood.toLowerCase()
			);

			if (!normalizedMood) {
				console.warn(
					`OpenAI returned invalid mood: ${mood}. Using default mood: Reflective`
				);
				return 'Reflective'; // Default if we get an invalid mood
			}

			console.log('Determined mood:', normalizedMood);
			return normalizedMood;
		} else {
			console.warn('Unexpected response format from OpenAI');
			return 'Reflective'; // Default in case of unexpected response
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(
				'Error analyzing mood:',
				error.response?.data || error.message
			);
		} else {
			console.error('Error analyzing mood:', error);
		}
		return 'Reflective'; // Default in case of error
	}
}

// Function to save the quote to the database
async function saveQuoteToDatabase(quote: string, mood: string) {
	try {
		console.log(`Saving quote to database with mood: ${mood}`);

		const affirmation = await prisma.affirmation.create({
			data: {
				content: quote,
				mood_type: mood,
			},
		});

		console.log('Quote saved to database with ID:', affirmation.id);
		return affirmation;
	} catch (error) {
		console.error('Error saving quote to database:', error);
		throw error;
	}
}

// Function to update the quotes file to mark a quote as analyzed
function markQuoteAsAnalyzed(quoteText: string): void {
	try {
		const quotesData = fs.readFileSync(QUOTES_FILE, 'utf8');
		const quotes: QuoteData[] = JSON.parse(quotesData);

		const updatedQuotes = quotes.map((q) => {
			if (q.quote === quoteText && !q.analyzed) {
				return { ...q, analyzed: true, analyzed_at: new Date().toISOString() };
			}
			return q;
		});

		fs.writeFileSync(QUOTES_FILE, JSON.stringify(updatedQuotes, null, 2));
		console.log('Quote marked as analyzed in file');
	} catch (error) {
		console.error('Error marking quote as analyzed:', error);
	}
}

// Main function
async function analyzeQuotes() {
	try {
		console.log('Starting quote analysis process...');

		if (!OPENAI_API_KEY) {
			throw new Error('OPENAI_API_KEY environment variable is not set');
		}

		const unanalyzedQuotes = getUnanalyzedQuotes();
		console.log(`Found ${unanalyzedQuotes.length} unanalyzed quotes`);

		if (unanalyzedQuotes.length === 0) {
			console.log('No quotes to analyze');
			return;
		}

		// Process only the first unanalyzed quote (as per requirement)
		const quoteToAnalyze = unanalyzedQuotes[0];

		if (!quoteToAnalyze || !quoteToAnalyze.quote) {
			throw new Error('Invalid quote data in file');
		}

		// Determine the mood
		const mood = await analyzeMood(quoteToAnalyze.quote);

		// Save to database
		await saveQuoteToDatabase(quoteToAnalyze.quote, mood);

		// Mark as analyzed
		markQuoteAsAnalyzed(quoteToAnalyze.quote);

		console.log('Quote analysis completed successfully');
	} catch (error) {
		console.error('Quote analysis failed:', error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the analysis process
analyzeQuotes();
