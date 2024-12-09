// backend/Util/pushNotification.js
import webPush from 'web-push';
import vapidKeys from '../Config/vapidKeys.js';

webPush.setVapidDetails(
  'mailto:your-email@example.com', // Update with your email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendNotification = async (subscription, payload) => {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error('Error sending notification:', error);
    // Handle subscription expiration
    if (error.statusCode === 410) {
      // Delete invalid subscription
      await deletePushSubscription(subscription.endpoint);
    }
  }
};

export default sendNotification;