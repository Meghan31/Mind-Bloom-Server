"use strict";
// import { configureApp } from "./appConfig";
// import { environment } from "./environment";
// import { appServer } from "./webSupport/appServer";
Object.defineProperty(exports, "__esModule", { value: true });
// appServer.start(8787, configureApp(environment.fromEnv()));
const appConfig_1 = require("./appConfig");
const environment_1 = require("./environment");
const prisma_1 = require("./lib/prisma");
const appServer_1 = require("./webSupport/appServer");
async function startServer() {
    try {
        // Test database connection first
        const isConnected = await (0, prisma_1.testDatabaseConnection)();
        if (!isConnected) {
            console.error('Failed to connect to the database. Server will not start.');
            process.exit(1);
        }
        // Start the server
        await appServer_1.appServer.start(8787, (0, appConfig_1.configureApp)(environment_1.environment.fromEnv()));
    }
    catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}
startServer();
