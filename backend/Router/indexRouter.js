import express from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import chatRouter from './chatRouter.js';
import connectionRouter from './connectionRouter.js';
import connectionRequestRouter from './connectionRequestRouter.js';
import feedRouter from './feedRouter.js';
import profileRouter from './router.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/chats', chatRouter);
router.use('/connections', connectionRouter);
router.use('/connection-requests', connectionRequestRouter);
router.use("/feed", feedRouter);
router.use("/profile", profileRouter);

export default router;