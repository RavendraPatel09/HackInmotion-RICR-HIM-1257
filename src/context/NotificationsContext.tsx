import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppNotification, NotificationType } from '../services/notificationService';
import {
  getNotifications,
  addNotificationToStorage,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotificationsFromStorage,
} from '../services/notificationService';

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  notify: (
    title: string,
    message: string,
    type: NotificationType,
    issueId?: string,
    trackingId?: string
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notify = useCallback(
    (
      title: string,
      message: string,
      type: NotificationType,
      issueId?: string,
      trackingId?: string
    ) => {
      const updated = addNotificationToStorage(title, message, type, issueId, trackingId);
      setNotifications(updated);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    const updated = markNotificationAsRead(id);
    setNotifications(updated);
  }, []);

  const markAllAsRead = useCallback(() => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  }, []);

  const clearNotifications = useCallback(() => {
    const updated = clearNotificationsFromStorage();
    setNotifications(updated);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        notify,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
