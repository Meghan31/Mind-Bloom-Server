// src/app.ts
import { configureApp } from './appConfig';
import { environment } from './environment';
import { disconnectPrisma, prisma, testDatabaseConnection } from './lib/prisma';
import { appServer } from './webSupport/appServer';

// Get port from environment variable or default to 8080 (Cloud Run default)
const PORT = parseInt(process.env.PORT || '8080', 10);

async function startServer() {
	try {
		console.log(`Starting server in ${process.env.NODE_ENV} mode`);

		// Test database connection first
		const isConnected = await testDatabaseConnection();

		if (!isConnected) {
			console.error(
				'Failed to connect to the database. Server will not start.'
			);
			process.exit(1);
		}

		// Start the server
		const server = await appServer.start(
			PORT,
			configureApp(environment.fromEnv())
		);
		console.log(`Server running on port ${PORT}`);

		// Handle graceful shutdown
		const shutdown = async (signal: string) => {
			console.log(`Received ${signal}. Shutting down gracefully...`);

			// Close the server first (stop accepting new connections)
			if (server && server.stop) {
				server.stop();
				console.log('HTTP server closed');
			}

			// Then disconnect from the database
			await disconnectPrisma();

			console.log('Server shut down complete');
			process.exit(0);
		};

		// Listen for termination signals
		process.on('SIGTERM', () => shutdown('SIGTERM'));
		process.on('SIGINT', () => shutdown('SIGINT'));
	} catch (error) {
		console.error('Server startup failed:', error);
		await disconnectPrisma();
		process.exit(1);
	}
}

startServer();
