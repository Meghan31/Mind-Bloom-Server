// src/middleware/auth.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
	user?: { userId: number; email: string; username: string };
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): void => {
	if (!JWT_SECRET) {
		res.status(500).json({ error: 'Server configuration error.' });
		return;
	}

	const authHeader = req.headers['authorization'];
	const token = authHeader?.split(' ')[1];

	if (!token) {
		res.status(401).json({ error: 'Access denied. No token provided.' });
		return;
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as {
			userId: number;
			email: string;
			username: string;
		};
		req.user = decoded;
		next();
	} catch {
		res.status(401).json({ error: 'Invalid or expired token.' });
	}
};
