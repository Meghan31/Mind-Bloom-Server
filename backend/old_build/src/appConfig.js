"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = void 0;
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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const handleIndex_1 = require("./handleIndex");
const prisma_1 = require("./lib/prisma");
const affirmationRoutes_1 = require("./routes/affirmationRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const journalRoutes_1 = require("./routes/journalRoutes");
const testRoutes_1 = require("./routes/testRoutes");
const staticFileHandler_1 = require("./webSupport/staticFileHandler");
const configureApp = (environment) => (app) => {
    // Middleware
    app.use((0, cors_1.default)()); // Enable CORS for the frontend to communicate with backend
    app.use(express_1.default.json()); // Parse JSON bodies
    // Basic routes
    handleIndex_1.index.registerHandler(app);
    // Replace the health check to use Prisma instead
    app.get('/health', async (req, res) => {
        try {
            // Check database connection using Prisma
            await prisma_1.prisma.$queryRaw `SELECT 1 as success`;
            res.json({ status: 'UP' });
        }
        catch (e) {
            console.error(e);
            res.json({ status: 'DOWN' });
        }
    });
    // API Routes
    (0, authRoutes_1.registerAuthRoutes)(app);
    (0, journalRoutes_1.registerJournalRoutes)(app);
    (0, affirmationRoutes_1.registerAffirmationRoutes)(app);
    (0, testRoutes_1.registerTestRoutes)(app); // Add test routes
    // Serve static files
    staticFileHandler_1.staticFileHandler.registerHandler(app);
};
exports.configureApp = configureApp;
