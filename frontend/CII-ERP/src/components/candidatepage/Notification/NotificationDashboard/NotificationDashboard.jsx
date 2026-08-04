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
  REFERENCE_TYPE_OPTIONS,
} from "../../../../config/notificationTypeConfig";

import styles from "./NotificationDashboard.module.css";

import orgLogo from "../../../../assets/Logo.png";

// Reference-type ids to hide from the filter row entirely. "INTERVIEW" and
// "EXAMINATION" were removed per product request — "EXAM" already covers
// the examination case, and "INTERVIEW" wasn't needed as a separate tab.
const HIDDEN_REFERENCE_TYPES = ["INTERVIEW", "EXAMINATION"];

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
  const { category, icon, color } = getNotificationTypeConfig(
    raw.notification_type,
    raw.reference_type
  );
  return {
    id: raw.user_notification_id,
    title: raw.title,
    description: raw.message,
    category,
    icon,
    color,
    referenceType: raw.reference_type, // used for the reference-type filter
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
  const [referenceTypeFilter, setReferenceTypeFilter] = useState("ALL");

  // The category tabs (All/Job/Examination/Academics/Events) were removed
  // from the UI, but fetchNotifications still takes a category param.
  // We just always fetch the unfiltered "All" category now; filtering by
  // reference type happens client-side below, same as before.
  const activeTab = "All";

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

  // Filters applied client-side, on top of whatever page/tab is already
  // loaded. Neither `searchValue` nor `referenceTypeFilter` re-fetches or
  // searches across unloaded pages — same limitation as before.
  const filteredBuckets = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    const matches = (n) => {
      const matchesQuery =
        !query ||
        n.title.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query);

      const matchesReferenceType =
        referenceTypeFilter === "ALL" || n.referenceType === referenceTypeFilter;

      return matchesQuery && matchesReferenceType;
    };

    return {
      today: buckets.today.filter(matches),
      yesterday: buckets.yesterday.filter(matches),
      older: buckets.older.filter(matches),
    };
  }, [buckets, searchValue, referenceTypeFilter]);

  const groupedNotifications = useMemo(
    () =>
      [
        ["TODAY", filteredBuckets.today],
        ["YESTERDAY", filteredBuckets.yesterday],
        ["OLDER", filteredBuckets.older],
      ].filter(([, items]) => items.length > 0),
    [filteredBuckets]
  );

  // Counts per reference type, computed from whatever's currently loaded
  // (allLoaded). NOTE: this is a client-side count of loaded pages only —
  // not a true global total. If the user hasn't paged through everything,
  // these numbers only reflect what's been fetched so far. A dedicated
  // counts endpoint would be needed for accurate totals across all pages.
  const referenceTypeCounts = useMemo(() => {
    const counts = {};
    allLoaded.forEach((n) => {
      if (!n.referenceType) return;
      counts[n.referenceType] = (counts[n.referenceType] ?? 0) + 1;
    });
    return counts;
  }, [allLoaded]);

  // Reference-type filter tabs: REFERENCE_TYPE_OPTIONS minus the hidden
  // ids, with a `count` field NotificationTabs renders in its own badge span.
  const referenceTypeTabs = useMemo(
    () =>
      REFERENCE_TYPE_OPTIONS.filter((opt) => !HIDDEN_REFERENCE_TYPES.includes(opt.id)).map(
        ({ id, label }) => {
          const count = id === "ALL" ? allLoaded.length : referenceTypeCounts[id] ?? 0;
          return { id, label, count };
        }
      ),
    [referenceTypeCounts, allLoaded]
  );

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

          <div className={styles.referenceTypeRow}>
            <NotificationTabs
              tabs={referenceTypeTabs}
              activeTab={referenceTypeFilter}
              onTabChange={setReferenceTypeFilter}
              className={styles.referenceTypeFilter}
              compact
            />
          </div>

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