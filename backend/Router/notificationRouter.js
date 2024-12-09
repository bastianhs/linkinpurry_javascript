import express from 'express';
import { createPushSubscription } from '../Model/pushSubscriptionsModel.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id; // Assuming you have user authentication

  await createPushSubscription(subscription.endpoint, userId, subscription.keys);
  res.status(201).json({});
});

export default router;