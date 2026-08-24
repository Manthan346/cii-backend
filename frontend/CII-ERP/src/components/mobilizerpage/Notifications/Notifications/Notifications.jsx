import React, { useEffect, useMemo, useState } from 'react';
import {
  getNotifications,
  getUnreadCount,
  subscribeNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../data/notificationsStore';
import NotificationRow from '../../shared/NotificationRow/NotificationRow';
import NotificationDetailModal from '../../shared/NotificationDetailModal/NotificationDetailModal';
import './Notifications.css';

const PAGE_SIZE = 6;

export default function Notifications() {
  const [notifications, setNotifications] = useState(getNotifications());
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());

  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [activeNotification, setActiveNotification] = useState(null);

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
    };

    const unsubscribe = subscribeNotifications(updateNotifications);

    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'Unread') {
      return notifications.filter((n) => !n.read);
    }

    return notifications;
  }, [notifications, activeTab]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;

  const pageItems = filtered.slice(
    start,
    start + PAGE_SIZE
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleRowClick = (notification) => {
    markNotificationAsRead(notification.id);

    setActiveNotification({
      ...notification,
      read: true,
    });
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  return (
    <div className="notifications-page">
      <div className="nt-header">
        <div>
          <h1 className="nt-header__title">
            Notifications
          </h1>

          <p className="nt-header__subtitle">
            Updates on enquiries, placements, events, and tasks
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="nt-mark-all-btn"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="nt-tabs">
        {['All', 'Unread'].map((tab) => (
          <button
            type="button"
            key={tab}
            className={`nt-tab ${
              tab === activeTab ? 'nt-tab--active' : ''
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === 'Unread'
              ? `Unread (${unreadCount})`
              : `All (${notifications.length})`}
          </button>
        ))}
      </div>

      <div className="nt-list-card">
        {pageItems.length === 0 ? (
          <div className="nt-empty">
            You're all caught up — no notifications here.
          </div>
        ) : (
          pageItems.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onClick={handleRowClick}
            />
          ))
        )}
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="nt-pagination">
          <button
            type="button"
            className="nt-pagination__btn"
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={safePage === 1}
          >
            &lt;
          </button>

          <span className="nt-pagination__label">
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            className="nt-pagination__btn"
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={safePage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

      <NotificationDetailModal
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />
    </div>
  );
}