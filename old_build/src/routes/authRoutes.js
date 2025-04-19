"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthRoutes = void 0;
// src/routes/authRoutes.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
// Secret key for JWT signing - in production, store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';
const registerAuthRoutes = (app) => {
    // Register a new user
    app.post('/api/auth/register', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            // Basic validation
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            // Check if email already exists
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            // Hash the password
            const saltRounds = 10;
            const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
            // Insert new user
            await prisma_1.prisma.user.create({
                data: {
                    username,
                    email,
                    password_hash: passwordHash,
                },
            });
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Login user
    app.post('/api/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            // Basic validation
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ error: 'Email and password are required' });
            }
            // Check if user exists
            const user = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Verify password
            const passwordMatch = await bcrypt_1.default.compare(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Create JWT token
            const token = jsonwebtoken_1.default.sign({
                userId: user.id,
                email: user.email,
                username: user.username,
            }, JWT_SECRET, { expiresIn: '24h' });
            // Return user info and token
            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.registerAuthRoutes = registerAuthRoutes;
