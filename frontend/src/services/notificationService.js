// frontend/src/services/notificationService.js

// export const subscribeToNotifications = async () => {
//     try {
//       const registration = await navigator.serviceWorker.ready;
//       const subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
//       });
  
//       await fetch('http://localhost:4001/api/notifications/subscribe', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', 
//         body: JSON.stringify(subscription)
//       });
  
//       return true;
//     } catch (error) {
//       console.error('Failed to subscribe:', error);
//       return false;
//     }
//   };