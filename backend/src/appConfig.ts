// // src/appConfig.ts
// import cors from 'cors';
// import express, { Express } from 'express';
// import { databaseTemplate } from './databaseSupport/databaseTemplate';
// import { Environment } from './environment';
// import { health } from './handleHealth';
// import { index } from './handleIndex';
// import { registerAffirmationRoutes } from './routes/affirmationRoutes';
// import { registerAuthRoutes } from './routes/authRoutes';
// import { registerJournalRoutes } from './routes/journalRoutes';
// import { registerTestRoutes } from './routes/testRoutes';
// import { staticFileHandler } from './webSupport/staticFileHandler';

// export const configureApp = (environment: Environment) => (app: Express) => {
// 	const dbTemplate = databaseTemplate.create(environment.databaseUrl);

// 	// Middleware
// 	app.use(cors()); // Enable CORS for the frontend to communicate with backend
// 	app.use(express.json()); // Parse JSON bodies

// 	// Basic routes
// 	index.registerHandler(app);
// 	health.registerHandler(app, dbTemplate);

// 	// API Routes
// 	registerAuthRoutes(app, dbTemplate);
// 	registerJournalRoutes(app, dbTemplate);
// 	registerAffirmationRoutes(app, dbTemplate);
// 	registerTestRoutes(app); // Add test routes

// 	// Serve static files
// 	staticFileHandler.registerHandler(app);
// };

// src/appConfig.ts
import cors from 'cors';
import express, { Express } from 'express';
import { Environment } from './environment';
import { health } from './handleHealth';
import { index } from './handleIndex';
import { prisma } from './lib/prisma';
import { registerAffirmationRoutes } from './routes/affirmationRoutes';
import { registerAuthRoutes } from './routes/authRoutes';
import { registerJournalRoutes } from './routes/journalRoutes';
import { registerTestRoutes } from './routes/testRoutes';
import { staticFileHandler } from './webSupport/staticFileHandler';

export const configureApp = (environment: Environment) => (app: Express) => {
	// Middleware
	app.use(cors()); // Enable CORS for the frontend to communicate with backend
	app.use(express.json()); // Parse JSON bodies

	// Basic routes
	index.registerHandler(app);

	// Replace the health check to use Prisma instead
	app.get('/health', async (req, res) => {
		try {
			// Check database connection using Prisma
			await prisma.$queryRaw`SELECT 1 as success`;
			res.json({ status: 'UP' });
		} catch (e) {
			console.error(e);
			res.json({ status: 'DOWN' });
		}
	});

	// API Routes
	registerAuthRoutes(app);
	registerJournalRoutes(app);
	registerAffirmationRoutes(app);
	registerTestRoutes(app); // Add test routes

	// Serve static files
	staticFileHandler.registerHandler(app);
};
