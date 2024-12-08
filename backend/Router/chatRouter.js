import express from 'express';
import { getChatsByUser, getMessages, createChat } from '../Controller/chatController.js';
import {authenticate} from '../Middleware/authenticate.js';
import { createChatValidator } from '../Middleware/Validator/chatValidator.js';
const router = express.Router();
// chatRouter.js
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management endpoints
 * 
 * /api/chats:
 *   get:
 *     summary: Get user chats
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user chats
 *   post:
 *     summary: Create new chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to_id
 *             properties:
 *               to_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat created successfully
 * 
 * /api/chats/messages:
 *   post:
 *     summary: Get chat messages
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otherUserId
 *             properties:
 *               otherUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/', authenticate, getChatsByUser);
router.post('/messages', authenticate, getMessages);
router.post('/', authenticate,createChatValidator, createChat);

export default router;