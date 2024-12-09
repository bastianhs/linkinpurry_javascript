// backend/Router/notificationRouter.js
import express from 'express';
import { createPushSubscription, deletePushSubscription } from '../Model/pushSubscriptionsModel.js';
import { authenticate } from '../Middleware/authenticate.js';

const router = express.Router();

router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const subscription = req.body;
    const userId = req.user.userId;
    await createPushSubscription(subscription.endpoint, userId, subscription.keys);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/unsubscribe', authenticate, async (req, res) => {
  try {
    const { endpoint } = req.body;
    await deletePushSubscription(endpoint);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;