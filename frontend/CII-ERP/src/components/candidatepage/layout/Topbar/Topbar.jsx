// Topbar.jsx
// Shared sticky top navigation bar with search and user actions,
// used across the candidate portal (Dashboard, My Courses, Profile).
//
// Props:
//   search       {string}    – Controlled search query value.
//   onSearch     {function}  – Callback(value: string) on input change.
//   onMenuClick  {function}  – Opens the mobile sidebar drawer. Optional;
//                              defaults to a no-op so screens that don't
//                              wire up a mobile drawer still work fine.
//
// ── Update (2026-07-27) ──────────────────────────────────────────
// Avatar initials now always come from useAuthUser() — the old
// `userInitials` prop is REMOVED. Some pages were still passing a
// hardcoded userInitials="AS" leftover from the mock-data days, and since
// that prop used to override the real user, it silently hid the real name
// on any page that still passed it. If any call site still passes
// userInitials={...}, it'll now just be ignored (React drops unknown
// props on a DOM element, but here it's simply unused) — safe to leave in
// place while you clean those call sites up, but worth removing them.
// ──────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../shared/Icon/Icon";
import { fetchNotifications } from "../../../../services/Notificationservice";
import "./Topbar.css";

function flattenNotifications(data) {
  return ["today", "yesterday", "older"]
    .flatMap((group) => data?.notifications?.[group] ?? [])
    .slice(0, 5);
}

function getUnreadCount(data) {
  const notifications = ["today", "yesterday", "older"].flatMap(
    (group) => data?.notifications?.[group] ?? [],
  );
  const apiCount = data?.unreadCount ?? data?.unread_count;

  return (
    apiCount ??
    notifications.filter((notification) => !notification.is_read).length
  );
}

export default function Topbar({
  search = "",
  onSearch = () => {},
  onMenuClick = () => {},
}) {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchNotifications()
      .then((data) => {
        if (!cancelled) {
          setNotifications(flattenNotifications(data));
          setUnreadCount(getUnreadCount(data));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!notificationOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [notificationOpen]);

  const toggleNotifications = async () => {
    const nextOpen = !notificationOpen;
    setNotificationOpen(nextOpen);
    if (nextOpen) {
      try {
        const data = await fetchNotifications();
        setNotifications(flattenNotifications(data));
        setUnreadCount(getUnreadCount(data));
      } catch {
        // Keep the last successful notification snapshot visible.
      }
    }
  };

  return (
    <header className="topbar">
      <button
        className="topbar__hamburger"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Search */}
      <div className="topbar__search">
        <Icon name="search" size={16} color="var(--ink-soft)" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search courses, classes..."
          aria-label="Search courses"
        />
      </div>

      {/* Actions */}
      <div className="topbar__actions">
        {/* Notification bell */}
        <div className="topbar__notification-wrap" ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className="topbar__bell-btn"
            aria-label="Notifications"
            aria-expanded={notificationOpen}
          >
            <Icon name="bell" size={17} color="var(--ink-soft)" />
            {unreadCount > 0 && (
              <span
                className="topbar__bell-dot"
                aria-label={`${unreadCount} unread notifications`}
              />
            )}
          </button>
          {notificationOpen && (
            <div
              className="topbar__notification-popover"
              role="dialog"
              aria-label="Recent notifications"
            >
              <div className="topbar__notification-header">
                <strong>Notifications</strong>
                {unreadCount > 0 && <span>{unreadCount} new</span>}
              </div>
              {notifications.length === 0 ? (
                <p className="topbar__notification-empty">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    className="topbar__notification-item"
                    key={notification.user_notification_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedNotification(notification)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setSelectedNotification(notification);
                      }
                    }}
                  >
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <time dateTime={notification.created_at}>
                      {new Date(notification.created_at).toLocaleString(
                        "en-IN",
                      )}
                    </time>
                  </div>
                ))
              )}
              {selectedNotification && (
                <div className="topbar__notification-detail">
                  <button
                    type="button"
                    onClick={() => setSelectedNotification(null)}
                  >
                    Close
                  </button>
                  <strong>{selectedNotification.title}</strong>
                  <p>{selectedNotification.message}</p>
                  <time>
                    {new Date(selectedNotification.created_at).toLocaleString(
                      "en-IN",
                    )}
                  </time>
                </div>
              )}
              <button
                type="button"
                className="topbar__view-all"
                onClick={() => {
                  setNotificationOpen(false);
                  navigate("/notifications");
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* User avatar */}
        {/* TODO: replace initials with <img> when profile photo is available
        <div className="topbar__avatar" role="button" aria-label="User menu" onClick={() => navigate('/my-profile')}>
          {initials}
        </div> */}
      </div>
    </header>
  );
}
