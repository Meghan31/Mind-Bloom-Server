// src/app.ts
import { configureApp } from './appConfig';
import { environment } from './environment';
import { disconnectPrisma, testDatabaseConnection } from './lib/prisma';
import { appServer } from './webSupport/appServer';

// Get port from environment variable or default to 8080
const PORT = parseInt(process.env.PORT || '8080', 10);

async function startServer() {
	try {
		console.log(
			`[Server] Starting Mind-Bloom server in ${
				process.env.NODE_ENV || 'development'
			} mode`
		);
		console.log(`[Server] Using port: ${PORT}`);

		// Load environment variables first
		const env = environment.fromEnv();

		// Test database connection
		console.log('[Database] Testing database connection...');
		const isConnected = await testDatabaseConnection();

		if (!isConnected) {
			console.error(
				'[Database] Failed to connect to the database. Server will not start.'
			);
			process.exit(1);
		}
		console.log('[Database] Database connection successful.');

		// Start the application server
		console.log('[Server] Starting the application server...');
		const server = await appServer
			.start(PORT, configureApp(env))
			.catch((startServerError) => {
				console.error(
					'[Server] Error during appServer.start():',
					startServerError
				);
				throw startServerError;
			});
		console.log(`[Server] Server running on ${server.address}`);

		// Handle graceful shutdown
		const shutdown = async (signal: string) => {
			console.log(`[Server] Received ${signal}. Shutting down gracefully...`);

			// Close the server first (stop accepting new connections)
			if (server && server.stop) {
				console.log('[Server] Closing HTTP server...');
				server.stop();
				console.log('[Server] HTTP server closed');
			}

			// Then disconnect from the database
			console.log('[Database] Disconnecting from database...');
			await disconnectPrisma();
			console.log('[Database] Database disconnected.');

			console.log('[Server] Server shut down complete');
			process.exit(0);
		};

		// Listen for termination signals
		process.on('SIGTERM', () => shutdown('SIGTERM'));
		process.on('SIGINT', () => shutdown('SIGINT'));

		// Set uncaught exception handler
		process.on('uncaughtException', (error) => {
			console.error('[Server] Uncaught exception:', error);
			shutdown('UNCAUGHT_EXCEPTION').catch(() => process.exit(1));
		});

		// Set unhandled rejection handler
		process.on('unhandledRejection', (reason, promise) => {
			console.error(
				'[Server] Unhandled rejection at:',
				promise,
				'reason:',
				reason
			);
		});
	} catch (error) {
		console.error('[Server] Server startup failed:', error);
		console.log(
			'[Database] Attempting to disconnect from database due to startup failure...'
		);
		await disconnectPrisma();
		console.log('[Database] Database disconnection attempt complete.');
		process.exit(1);
	}
}

// Start the server
startServer();
