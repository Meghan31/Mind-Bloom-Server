"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const appConfig_1 = require("./appConfig");
const environment_1 = require("./environment");
const prisma_1 = require("./lib/prisma");
const appServer_1 = require("./webSupport/appServer");
// Get port from environment variable or default to 8080 (Cloud Run default)
const PORT = parseInt(process.env.PORT || '8080', 10);
async function startServer() {
    try {
        console.log(`Starting server in ${process.env.NODE_ENV} mode`);
        // Test database connection first
        const isConnected = await (0, prisma_1.testDatabaseConnection)();
        if (!isConnected) {
            console.error('Failed to connect to the database. Server will not start.');
            process.exit(1);
        }
        // Start the server
        const server = await appServer_1.appServer.start(PORT, (0, appConfig_1.configureApp)(environment_1.environment.fromEnv()));
        console.log(`Server running on port ${PORT}`);
        // Handle graceful shutdown
        const shutdown = async (signal) => {
            console.log(`Received ${signal}. Shutting down gracefully...`);
            // Close the server first (stop accepting new connections)
            if (server && server.stop) {
                server.stop();
                console.log('HTTP server closed');
            }
            // Then disconnect from the database
            await (0, prisma_1.disconnectPrisma)();
            console.log('Server shut down complete');
            process.exit(0);
        };
        // Listen for termination signals
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        console.error('Server startup failed:', error);
        await (0, prisma_1.disconnectPrisma)();
        process.exit(1);
    }
}
startServer();
