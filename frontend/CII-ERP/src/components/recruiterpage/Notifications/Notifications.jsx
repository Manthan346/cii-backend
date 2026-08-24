import React, { useState } from 'react';
import { notifications as initialNotifications, notificationTypeStyles } from '../data';
import NotificationDetailsModal from './NotificationDetailsModal/NotificationDetailsModal';
import './Notifications.css';

const TABS = ['All', 'Unread'];

/**
 * Notifications (Recruiter)
 *
 * Page header + "Mark all as read", All/Unread filter tabs, and the
 * notification list itself. Clicking any card both marks that one
 * notification read and opens NotificationDetailsModal for it.
 */
const Notifications = () => {
  const [notificationsList, setNotificationsList] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const unreadCount = notificationsList.filter((item) => item.unread).length;
  const visibleNotifications = activeTab === 'Unread'
    ? notificationsList.filter((item) => item.unread)
    : notificationsList;
  const selectedNotification = notificationsList.find((item) => item.id === selectedId) ?? null;

  const handleMarkAllAsRead = () => {
    setNotificationsList((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handleOpenNotification = (id) => {
    setSelectedId(id);
    setNotificationsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  return (
    <div className="notifications-page">
      <header className="notifications-page__header">
        <div>
          <h1 className="notifications-page__title">Notifications</h1>
          <p className="notifications-page__subtitle">Updates on applications, interviews, and job postings</p>
        </div>

        <button type="button" className="notifications-page__mark-read-btn" onClick={handleMarkAllAsRead}>
          Mark all as read
        </button>
      </header>

      <div className="notifications-page__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`notifications-page__tab ${activeTab === tab ? 'notifications-page__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} ({tab === 'Unread' ? unreadCount : notificationsList.length})
          </button>
        ))}
      </div>

      <div className="notifications-page__list">
        {visibleNotifications.map((item) => {
          const Icon = item.icon;
          const style = notificationTypeStyles[item.type] ?? {};

          return (
            <button
              key={item.id}
              type="button"
              className="notifications-page__card"
              onClick={() => handleOpenNotification(item.id)}
            >
              <span className="notifications-page__icon" style={{ backgroundColor: style.bg }}>
                <Icon size={18} color={style.color} strokeWidth={2} />
              </span>

              <div className="notifications-page__content">
                <span className="notifications-page__card-title">{item.title}</span>
                <p className="notifications-page__description">{item.description}</p>
                <span className="notifications-page__time">{item.time}</span>
              </div>

              {item.unread && <span className="notifications-page__unread-dot" aria-hidden="true" />}
            </button>
          );
        })}

        {visibleNotifications.length === 0 && (
          <p className="notifications-page__empty">You're all caught up.</p>
        )}
      </div>

      <NotificationDetailsModal
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default Notifications;
