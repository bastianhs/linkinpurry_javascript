import webPush from 'web-push';
import { getPushSubscriptions } from '../Model/pushSubscriptionsModel.js';

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendNotification = async (userId, payload) => {
  const subscriptions = await getPushSubscriptions(userId);

  subscriptions.forEach(subscription => {
    webPush.sendNotification(subscription, JSON.stringify(payload))
      .catch(error => console.error('Error sending notification:', error));
  });
};

export default sendNotification;