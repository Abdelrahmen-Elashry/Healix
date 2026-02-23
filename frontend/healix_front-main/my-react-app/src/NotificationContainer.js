import React, { useState, useCallback } from 'react';
import Notification from './Notification';

let addNotificationCallback = null;

export const showNotification = (message, type = 'info', duration = 4000) => {
  if (addNotificationCallback) {
    addNotificationCallback(message, type, duration);
  }
};

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type, duration) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Register the callback
  React.useEffect(() => {
    addNotificationCallback = addNotification;
    return () => {
      addNotificationCallback = null;
    };
  }, [addNotification]);

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 10000 }}>
      {notifications.map((notification, index) => (
        <div key={notification.id} style={{ marginBottom: index > 0 ? '80px' : '0' }}>
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
