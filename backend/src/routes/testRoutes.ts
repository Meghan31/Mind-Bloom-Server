// src/routes/testRoutes.ts
import { Express } from 'express';

export const registerTestRoutes = (app: Express) => {
	// Test endpoint to verify routing is working
	app.get('/api/test', (req, res) => {
		res.json({ message: 'API test endpoint is working!' });
	});

	// Test endpoint to verify POST requests are working
	app.post('/api/test', (req, res) => {
		const receivedData = req.body;
		res.status(200).json({
			message: 'POST test endpoint is working!',
			received: receivedData,
		});
	});
};
