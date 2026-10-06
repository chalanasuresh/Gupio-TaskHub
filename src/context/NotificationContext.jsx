import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadNotificationsFromStorage, saveNotificationsToStorage } from '../utils/storage';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => loadNotificationsFromStorage());

  // Synchronize changes to localStorage
  useEffect(() => {
    saveNotificationsToStorage(notifications);
  }, [notifications]);

  const addNotification = useCallback(({ title, message, type = 'info', taskId = null }) => {
    const item = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      signature: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      taskId,
    };
    setNotifications((prev) => [item, ...prev].slice(0, 30));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
