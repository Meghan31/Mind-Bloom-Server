// // src/appConfig.ts
// import cors from 'cors';
// import express, { Express } from 'express';
// import { Environment } from './environment';
// import { index } from './handleIndex';
// import { prisma } from './lib/prisma';
// import { registerAffirmationRoutes } from './routes/affirmationRoutes';
// import { registerAuthRoutes } from './routes/authRoutes';
// import { registerJournalRoutes } from './routes/journalRoutes';
// import { registerTestRoutes } from './routes/testRoutes';
// import { staticFileHandler } from './webSupport/staticFileHandler';

// export const configureApp = (environment: Environment) => (app: Express) => {
// 	// Logging middleware
// 	app.use((req, res, next) => {
// 		console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
// 		next();
// 	});

// 	// CORS configuration - allow frontend domains
// 	app.use(
// 		cors({
// 			origin: ['*'],
// 			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
// 			allowedHeaders: ['Content-Type', 'Authorization'],
// 			credentials: true, // Allow credentials
// 			preflightContinue: false,
// 			optionsSuccessStatus: 204,
// 		})
// 	);

// 	// Parse JSON request bodies
// 	app.use(express.json());

// 	// Basic routes
// 	index.registerHandler(app);

// 	// Health check endpoint
// 	app.get('/health', async (req, res) => {
// 		try {
// 			// Check database connection using Prisma
// 			await prisma.$queryRaw`SELECT 1 as success`;
// 			res.json({ status: 'UP', database: 'connected' });
// 		} catch (e) {
// 			console.error('Health check failed:', e);
// 			res.status(500).json({ status: 'DOWN', database: 'disconnected' });
// 		}
// 	});

// 	// API version info
// 	app.get('/api/version', (req, res) => {
// 		res.json({
// 			version: '1.0.0',
// 			environment: environment.nodeEnv,
// 			timestamp: new Date().toISOString(),
// 		});
// 	});

// 	// Register all API routes
// 	registerAuthRoutes(app);
// 	registerJournalRoutes(app);
// 	registerAffirmationRoutes(app);
// 	registerTestRoutes(app);

// 	// Serve static files
// 	staticFileHandler.registerHandler(app);

// 	// Error handling middleware (should be last)
// 	app.use((err: any, req: any, res: any, next: any) => {
// 		console.error('Unhandled error:', err);
// 		res.status(500).json({
// 			error: 'Internal server error',
// 			message: process.env.NODE_ENV === 'production' ? undefined : err.message,
// 		});
// 	});

// 	console.log('Application configured successfully');
// };

// src/appConfig.ts
import cors from 'cors';
import express, { Express } from 'express';
import { Environment } from './environment';
import { index } from './handleIndex';
import { prisma } from './lib/prisma';
import { registerAffirmationRoutes } from './routes/affirmationRoutes';
import { registerAuthRoutes } from './routes/authRoutes';
import { registerJournalRoutes } from './routes/journalRoutes';
import { registerTestRoutes } from './routes/testRoutes';
import { staticFileHandler } from './webSupport/staticFileHandler';

export const configureApp = (environment: Environment) => (app: Express) => {
	// Logging middleware
	app.use((req, res, next) => {
		console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

		// CORS headers for all requests, including preflight
		res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		);
		res.header(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, DELETE, OPTIONS'
		);

		// Handle preflight OPTIONS requests
		if (req.method === 'OPTIONS') {
			return res.status(200).end();
		}

		next();
	});

	// CORS configuration
	app.use(
		cors({
			origin: '*', // Allow any origin for now (you can restrict this later)
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
			preflightContinue: false,
			optionsSuccessStatus: 204,
		})
	);

	// Parse JSON request bodies
	app.use(express.json());

	// Basic routes
	index.registerHandler(app);

	// Health check endpoint
	app.get('/health', async (req, res) => {
		try {
			// Check database connection using Prisma
			await prisma.$queryRaw`SELECT 1 as success`;
			res.json({ status: 'UP', database: 'connected' });
		} catch (e) {
			console.error('Health check failed:', e);
			res.status(500).json({ status: 'DOWN', database: 'disconnected' });
		}
	});

	// API version info
	app.get('/api/version', (req, res) => {
		res.json({
			version: '1.0.0',
			environment: environment.nodeEnv,
			timestamp: new Date().toISOString(),
		});
	});

	// Register all API routes
	registerAuthRoutes(app);
	registerJournalRoutes(app);
	registerAffirmationRoutes(app);
	registerTestRoutes(app);

	// Serve static files
	staticFileHandler.registerHandler(app);

	// Error handling middleware (should be last)
	app.use((err: any, req: any, res: any, next: any) => {
		console.error('Unhandled error:', err);
		res.status(500).json({
			error: 'Internal server error',
			message: process.env.NODE_ENV === 'production' ? undefined : err.message,
		});
	});

	console.log('Application configured successfully');
};
