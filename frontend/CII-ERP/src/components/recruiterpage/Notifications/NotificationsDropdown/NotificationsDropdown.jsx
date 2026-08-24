import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications, notificationTypeStyles } from '../../data';
import './NotificationsDropdown.css';

const PREVIEW_COUNT = 4;

/**
 * NotificationsDropdown
 *
 * Quick-preview panel opened by clicking the bell in Topbar. Shows
 * the first few notifications (same data + icon/color mapping as the
 * full Notifications page), a "Mark all as read" link, and a
 * "View all" button that navigates to /recruiter/notifications and
 * closes the panel.
 *
 * NOTE: this reads `notifications` straight from data/notificationsData.js
 * for the preview list and unread dots. It doesn't share React state
 * with the Notifications page (each currently keeps its own local
 * read/unread state) - marking something read here or there won't be
 * reflected in the other until a shared store (e.g. Context) is
 * introduced. Fine for now since this is just a quick preview.
 *
 * Lives under Notifications/ (not layout/Topbar/) since it's
 * notification-domain UI - Topbar just imports it.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - anchorRef: ref to the bell button, used to close on outside click
 */
const NotificationsDropdown = ({ isOpen, onClose, anchorRef }) => {
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const previewNotifications = notifications.slice(0, PREVIEW_COUNT);

  const handleViewAll = () => {
    onClose();
    navigate('/recruiter/notifications');
  };

  return (
    <div className="notifications-dropdown" ref={panelRef}>
      <div className="notifications-dropdown__header">
        <span className="notifications-dropdown__title">Notifications</span>
        <button type="button" className="notifications-dropdown__mark-read">
          Mark all as read
        </button>
      </div>

      <div className="notifications-dropdown__list">
        {previewNotifications.map((item) => {
          const Icon = item.icon;
          const style = notificationTypeStyles[item.type] ?? {};

          return (
            <button
              key={item.id}
              type="button"
              className="notifications-dropdown__item"
              onClick={handleViewAll}
            >
              <span className="notifications-dropdown__icon" style={{ backgroundColor: style.bg }}>
                <Icon size={16} color={style.color} strokeWidth={2} />
              </span>

              <div className="notifications-dropdown__content">
                <span className="notifications-dropdown__item-title">
                  {item.title}
                  {item.unread && <span className="notifications-dropdown__unread-dot" />}
                </span>
                <p className="notifications-dropdown__description">{item.description}</p>
                <span className="notifications-dropdown__time">{item.time}</span>
              </div>
            </button>
          );
        })}
      </div>

      <button type="button" className="notifications-dropdown__view-all" onClick={handleViewAll}>
        View all
      </button>
    </div>
  );
};

export default NotificationsDropdown;
