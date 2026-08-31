import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { fetchMobilizerNotifications } from "../../../../../api/mobilizer/notificationService";
import NotificationRow from "../NotificationRow/NotificationRow";
import NotificationDetailModal from "../NotificationDetailModal/NotificationDetailModal";
import "./NotificationBell.css";

const DROPDOWN_LIMIT = 5;

export default function NotificationBell({ onViewAll }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { notifications: items } = await fetchMobilizerNotifications({
        limit: DROPDOWN_LIMIT,
      });

      setNotifications(items);
      setUnreadCount(items.filter((item) => !item.read).length);
    } catch (error) {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRowClick = (notification) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - (notification.read ? 0 : 1)));
    setActiveNotification({ ...notification, read: true });
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
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
        onClick={() => {
          setOpen((v) => !v);
          if (!open) loadNotifications();
        }}
        aria-label={`Notifications${
          unreadCount > 0 ? ` (${unreadCount} unread)` : ""
        }`}
      >
        <Bell size={18} />

        {unreadCount > 0 && <span className="nb-trigger__badge" />}
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
              {loading ? (
                <div className="nb-panel__empty">Loading notifications...</div>
              ) : notifications.length ? (
                notifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    compact
                    onClick={handleRowClick}
                  />
                ))
              ) : (
                <div className="nb-panel__empty">No notifications yet.</div>
              )}
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
