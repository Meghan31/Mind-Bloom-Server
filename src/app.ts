// import { configureApp } from "./appConfig";
// import { environment } from "./environment";
// import { appServer } from "./webSupport/appServer";

// appServer.start(8787, configureApp(environment.fromEnv()));

import { configureApp } from './appConfig';
import { environment } from './environment';
import { testDatabaseConnection } from './lib/prisma';
import { appServer } from './webSupport/appServer';

async function startServer() {
	try {
		// Test database connection first
		const isConnected = await testDatabaseConnection();

		if (!isConnected) {
			console.error(
				'Failed to connect to the database. Server will not start.'
			);
			process.exit(1);
		}

		// Start the server
		await appServer.start(8080, configureApp(environment.fromEnv()));
	} catch (error) {
		console.error('Server startup failed:', error);
		process.exit(1);
	}
}

startServer();
