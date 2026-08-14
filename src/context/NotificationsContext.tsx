import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppNotification } from '../services/notificationService';
import { notificationApi } from '../services/api';
import { useAuth } from './AuthContext';

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  notify: (
    title: string,
    message: string,
    type: any,
    issueId?: string,
    trackingId?: string
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { isAuthenticated } = useAuth();

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    try {
      const loaded = await notificationApi.list();
      setNotifications(loaded);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notify = useCallback(
    async (
      _title: string,
      _message: string,
      _type: any,
      _issueId?: string,
      _trackingId?: string
    ) => {
      await loadNotifications();
    },
    [loadNotifications]
  );

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationApi.read(id);
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  }, [loadNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.readAll();
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  }, [loadNotifications]);

  const clearNotifications = useCallback(async () => {
    try {
      await notificationApi.clearAll();
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  }, [loadNotifications]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
        deleteNotification,
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
