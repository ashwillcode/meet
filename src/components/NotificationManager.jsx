import React, { useState, useEffect } from 'react';
import './NotificationManager.css';

const NotificationManager = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show prompt if we haven't asked for permission yet
    if (permission === 'default') {
      setShowPrompt(true);
    }
  }, [permission]);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setShowPrompt(false);

      if (result === 'granted') {
        // Register for push notifications
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY)
        });

        // TODO: Send subscription to server
        console.log('Push Subscription:', subscription);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!showPrompt) return null;

  return (
    <div className="notification-prompt">
      <div className="notification-content">
        <svg 
          className="notification-icon" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
            fill="currentColor"
          />
        </svg>
        <div className="notification-text">
          <p>Get notified about new events and updates</p>
          <p className="notification-subtext">We'll let you know when there are events in your area</p>
        </div>
        <div className="notification-buttons">
          <button onClick={requestPermission} className="allow-button">
            Allow notifications
          </button>
          <button onClick={dismissPrompt} className="dismiss-button">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationManager; 