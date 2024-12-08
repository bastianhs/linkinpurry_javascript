import express from 'express';
import { getChatsByUser, getMessages, createChat } from '../Controller/chatController.js';
import {authenticate} from '../Middleware/authenticate.js';

const router = express.Router();

router.get('/', authenticate, getChatsByUser);
router.post('/messages', authenticate, getMessages);
router.post('/', authenticate, createChat);

export default router;