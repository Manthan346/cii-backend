import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  subscribeNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../data/notificationsStore';
import NotificationRow from '../NotificationRow/NotificationRow';
import NotificationDetailModal from '../NotificationDetailModal/NotificationDetailModal';
import './NotificationBell.css';

const DROPDOWN_LIMIT = 5;

export default function NotificationBell({ onViewAll }) {
  const [notifications, setNotifications] = useState(getNotifications());
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());

  const [open, setOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
    };

    const unsubscribe = subscribeNotifications(updateNotifications);

    return unsubscribe;
  }, []);

  const handleRowClick = (notification) => {
    markNotificationAsRead(notification.id);

    setActiveNotification({
      ...notification,
      read: true,
    });

    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleViewAll = () => {
    setOpen(false);
    onViewAll?.();
  };

  return (
    <div className="nb-wrap">
      <button
        type="button"
        className="nb-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${
          unreadCount > 0 ? ` (${unreadCount} unread)` : ''
        }`}
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="nb-trigger__badge" />
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="nb-backdrop"
            onClick={() => setOpen(false)}
            aria-label="Close notifications"
          />

          <div className="nb-panel">
            <div className="nb-panel__header">
              <h3>Notifications</h3>

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="nb-panel__mark-all"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="nb-panel__list">
              {notifications
                .slice(0, DROPDOWN_LIMIT)
                .map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    compact
                    onClick={handleRowClick}
                  />
                ))}
            </div>

            <button
              type="button"
              className="nb-panel__view-all"
              onClick={handleViewAll}
            >
              View all
            </button>
          </div>
        </>
      )}

      <NotificationDetailModal
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />
    </div>
  );
}