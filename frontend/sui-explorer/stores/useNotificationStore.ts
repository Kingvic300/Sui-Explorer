import { create } from 'zustand';
// FIX: Corrected import path for Notification type.
import { Notification } from '../types/index';
import { notificationsData } from '../data/notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: notificationsData,
  unreadCount: notificationsData.filter(n => !n.read).length,
  markAllAsRead: () =>
    set((state) => {
      const allRead = state.notifications.map(n => ({ ...n, read: true }));
      return {
        notifications: allRead,
        unreadCount: 0,
      };
    }),
}));