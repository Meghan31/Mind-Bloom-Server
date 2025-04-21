"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = void 0;
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
    app.use((0, cors_1.default)({
        origin: [
            'https://fse-mindbloom-k3kv.vercel.app',
            'http://localhost:5173',
        ], // Or specify your frontend domains
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })); // Enable CORS for the frontend to communicate with backend
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
