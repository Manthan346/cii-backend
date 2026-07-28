import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import SectionHeading from "../../shared/SectionHeading/SectionHeading";
import NotificationTabs from "../../shared/NotificationTabs/NotificationTabs";
import NotificationCard from "../../shared/NotificationCard/NotificationCard";

import { fetchNotifications } from "../../../../services/Notificationservice";
import {
  getNotificationTypeConfig,
  buildNotificationLink,
} from "../../../../config/notificationTypeConfig";

import styles from "./NotificationDashboard.module.css";

import orgLogo from "../../../../assets/Logo.png";

// "Finance" removed from the tab list — the backend has no matching
// category yet (see notificationService.js). Add it back once the
// backend's CATEGORY_MAP grows a `finance` group.
const TAB_CONFIG = [
  { id: "All", label: "All" },
  { id: "Job", label: "Job" },
  { id: "Examination", label: "Examination" },
  { id: "Academics", label: "Academics" },
];

function formatRelativeTime(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  return new Date(isoDate).toLocaleDateString("en-IN", {
    weekday: diffHours < 24 * 7 ? "long" : undefined,
    hour: "numeric",
    minute: "2-digit",
  });
}

// Backend shape -> what NotificationCard renders.
function mapNotification(raw) {
  const { category, icon, color } = getNotificationTypeConfig(raw.notification_type);
  return {
    id: raw.user_notification_id,
    title: raw.title,
    description: raw.message,
    category,
    icon,
    color,
    // is_read here is the value captured BEFORE the backend's GET-marks-read
    // side effect — i.e. "was this unread when the user opened this page".
    isUnread: !raw.is_read,
    createdAt: raw.created_at,
    link: buildNotificationLink(raw.reference_type, raw.reference_id),
  };
}

function NotificationDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [buckets, setBuckets] = useState({ today: [], yesterday: [], older: [] });
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({ nextCursor: null, hasNextPage: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(async (tabId, cursor, { append } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(tabId, cursor);
      const mapped = {
        today: data.notifications.today.map(mapNotification),
        yesterday: data.notifications.yesterday.map(mapNotification),
        older: data.notifications.older.map(mapNotification),
      };

      setBuckets((prev) =>
        append
          ? {
              today: [...prev.today, ...mapped.today],
              yesterday: [...prev.yesterday, ...mapped.yesterday],
              older: [...prev.older, ...mapped.older],
            }
          : mapped
      );
      setUnreadCount(data.unreadCount);
      setPagination(data.pagination);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Couldn't load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch (fresh, not appended) whenever the tab changes.
  useEffect(() => {
    loadPage(activeTab, undefined, { append: false });
  }, [activeTab, loadPage]);

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loading) {
      loadPage(activeTab, pagination.nextCursor, { append: true });
    }
  };

  const allLoaded = useMemo(
    () => [...buckets.today, ...buckets.yesterday, ...buckets.older],
    [buckets]
  );

  const filteredBuckets = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return buckets;

    const matches = (n) =>
      n.title.toLowerCase().includes(query) || n.category.toLowerCase().includes(query);

    return {
      today: buckets.today.filter(matches),
      yesterday: buckets.yesterday.filter(matches),
      older: buckets.older.filter(matches),
    };
  }, [buckets, searchValue]);

  const groupedNotifications = useMemo(
    () =>
      [
        ["TODAY", filteredBuckets.today],
        ["YESTERDAY", filteredBuckets.yesterday],
        ["OLDER", filteredBuckets.older],
      ].filter(([, items]) => items.length > 0),
    [filteredBuckets]
  );

  // NOTE: tab badge counts (e.g. "JOB 4") aren't shown here — the API only
  // returns counts for whichever single category is currently loaded, not
  // totals per category. That needs a dedicated counts endpoint.
  const tabs = useMemo(() => TAB_CONFIG.map(({ id, label }) => ({ id, label })), []);

  // Clicking just navigates. There's no PATCH /notifications/:id/read
  // endpoint — the backend already marks a page's items read the moment
  // it's fetched (see candidate-getAllNotification.ts), so no client call
  // is needed here.
  const handleNotificationClick = (id) => {
    const notification = allLoaded.find((item) => item.id === id);
    if (notification?.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        orgLogoSrc={orgLogo}
        activeItem="Notifications"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={styles.content}>
        <Topbar
          search={searchValue}
          onSearch={setSearchValue}
          userInitials="AS"
          onMenuClick={() => setSidebarOpen((open) => !open)}
        />

        <main className={styles.main}>
          <SectionHeading
            title="Notification"
            subtitle={`${unreadCount} Unread · Stay On Top of Deadlines, Classes, and Updates`}
          />

          <NotificationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <section className={styles.notificationColumn} aria-label="Notification list">
            {error && <p className={styles.emptyState}>{error}</p>}

            {!error && groupedNotifications.length === 0 && !loading && (
              <p className={styles.emptyState}>No notifications match your filters.</p>
            )}

            {groupedNotifications.map(([groupLabel, items]) => (
              <div key={groupLabel} className={styles.group}>
                <h2 className={styles.groupLabel}>{groupLabel}</h2>
                <div className={styles.cardList}>
                  {items.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      id={notification.id}
                      title={notification.title}
                      description={notification.description}
                      category={notification.category}
                      color={notification.color}
                      icon={notification.icon}
                      isUnread={notification.isUnread}
                      time={formatRelativeTime(notification.createdAt)}
                      onSelect={handleNotificationClick}
                    />
                  ))}
                </div>
              </div>
            ))}

            {pagination.hasNextPage && (
              <button
                type="button"
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? "Loading…" : "Load more"}
              </button>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default NotificationDashboard;