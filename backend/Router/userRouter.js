import express from "express";
import { getUsers,getProfile,updateProfile} from "../Controller/userController.js";
import {authenticate} from "../Middleware/authenticate.js";
import { createRateLimiter } from '../Middleware/rateLimiter.js';
import { requestLogger } from "../Middleware/requestLogger.js";
import { updateProfileValidator } from "../Middleware/Validator/userValidator.js";
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 * 
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by username
 *     responses:
 *       200:
 *         description: List of users
 * 
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */

router.use(requestLogger);
router.use(apiLimiter);
router.get("/", authenticate, getUsers);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidator, updateProfile);

export default router;