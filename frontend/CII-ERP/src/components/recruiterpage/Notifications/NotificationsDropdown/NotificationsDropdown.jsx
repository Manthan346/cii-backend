import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchRecruiterNotifications,
  notificationTypeStyles,
} from "../../../../../api/recruiter/notificationService";
import "./NotificationsDropdown.css";

const PREVIEW_COUNT = 4;

/**
 * NotificationsDropdown
 *
 * Quick-preview panel opened by clicking the bell in Topbar. Fetches
 * real notifications from the same source as the full Notifications
 * page (fetchRecruiterNotifications / notificationTypeStyles from
 * api/recruiter/notificationService.js), limited to the first 4.
 *
 * "Mark all as read" has no backend endpoint — it's local-only: it
 * flips `unread` to false in this component's own state so the dots
 * disappear immediately, but reopening the dropdown later (or a page
 * reload) will refetch and show them as unread again since nothing
 * is persisted server-side. Deliberate stopgap, not a bug.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - anchorRef: ref to the bell button, used to close on outside click
 */
const NotificationsDropdown = ({ isOpen, onClose, anchorRef }) => {
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    fetchRecruiterNotifications({ page: 1, limit: PREVIEW_COUNT })
      .then((data) => !cancelled && setNotifications(data.notifications))
      .catch((err) => {
        console.error("Failed to load notifications:", err);
        if (!cancelled) setNotifications([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false })),
    );
  };

  const handleViewAll = () => {
    onClose();
    navigate("/recruiter/notifications");
  };

  return (
    <div className="notifications-dropdown" ref={panelRef}>
      <div className="notifications-dropdown__header">
        <span className="notifications-dropdown__title">Notifications</span>
        <button
          type="button"
          className="notifications-dropdown__mark-read"
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </button>
      </div>

      <div className="notifications-dropdown__list">
        {loading && (
          <p className="notifications-dropdown__loading">Loading...</p>
        )}

        {!loading && notifications.length === 0 && (
          <p className="notifications-dropdown__empty">No notifications yet.</p>
        )}

        {!loading &&
          notifications.map((item) => {
            const Icon = item.icon;
            const style = notificationTypeStyles[item.type] ?? {};

            return (
              <button
                key={item.id}
                type="button"
                className="notifications-dropdown__item"
                onClick={handleViewAll}
              >
                <span
                  className="notifications-dropdown__icon"
                  style={{ backgroundColor: style.bg }}
                >
                  <Icon size={16} color={style.color} strokeWidth={2} />
                </span>

                <div className="notifications-dropdown__content">
                  <span className="notifications-dropdown__item-title">
                    {item.title}
                    {item.unread && (
                      <span className="notifications-dropdown__unread-dot" />
                    )}
                  </span>
                  <p className="notifications-dropdown__description">
                    {item.description}
                  </p>
                  <span className="notifications-dropdown__time">
                    {item.time}
                  </span>
                </div>
              </button>
            );
          })}
      </div>

      <button
        type="button"
        className="notifications-dropdown__view-all"
        onClick={handleViewAll}
      >
        View all
      </button>
    </div>
  );
};

export default NotificationsDropdown;
