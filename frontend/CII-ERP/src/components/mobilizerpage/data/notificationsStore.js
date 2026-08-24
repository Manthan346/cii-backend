import { notificationsData } from './notificationsData';

let notifications = [...notificationsData];

const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const getNotifications = () => notifications;

export const subscribeNotifications = (listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const getUnreadCount = () => {
  return notifications.filter((n) => !n.read).length;
};

export const markNotificationAsRead = (id) => {
  notifications = notifications.map((notification) =>
    notification.id === id
      ? { ...notification, read: true }
      : notification
  );

  notify();
};

export const markAllNotificationsAsRead = () => {
  notifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));

  notify();
};