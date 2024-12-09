import express from "express";
import authentication from "../Controller/authControllers.js";
import {authenticate} from "../Middleware/authenticate.js";
import { loginValidator,registerValidator } from "../Middleware/Validator/authValidator.js";
import { createRateLimiter } from '../Middleware/rateLimiter.js';
import { requestLogger } from '../Middleware/requestLogger.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 * 
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - name
 *             properties:
 *               username: 
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Username/email already exists
 * 
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 * 
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */

// const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes

router.post("/login",loginValidator,authentication.login);
router.post("/register", registerValidator,authentication.register);
router.post("/logout", authenticate, authentication.logout);
router.get("/protected", authenticate, (req, res) => {
	res.json({ message: "Welcome to the protected route!", user: req.user });
});

export default router; 
