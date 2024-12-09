// frontend/src/Components/NotificationToggle.js
import React, { useState, useEffect } from 'react';

const NotificationToggle = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
    setLoading(false);
  };

  const handleToggle = async () => {
    if (isSubscribed) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      await subscription.unsubscribe();
      await fetch('http://localhost:4001/api/notifications/unsubscribe', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
    } else {
      await subscribeToNotifications();
    }
    await checkSubscriptionStatus();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <button onClick={handleToggle}>
      {isSubscribed ? 'Disable Notifications' : 'Enable Notifications'}
    </button>
  );
};

export default NotificationToggle;