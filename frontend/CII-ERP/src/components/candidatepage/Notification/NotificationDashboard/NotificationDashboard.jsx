import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../layout/Sidebar/Sidebar';
import Topbar from '../../layout/Topbar/Topbar';
import SectionHeading from '../../shared/SectionHeading/SectionHeading';
import NotificationTabs from '../../shared/NotificationTabs/NotificationTabs';
import NotificationCard from '../../shared/NotificationCard/NotificationCard';
import NotificationPreference from '../../shared/NotificationPreference/NotificationPreference';

import notificationData from '../../../../data/notificationData';
import notificationPreferenceData from '../../../../data/notificationPreferenceData';

import styles from './NotificationDashboard.module.css';

// Tab -> category mapping. "All" has no category filter.
const TAB_CONFIG = [
  { id: 'All', label: 'All', category: null },
  { id: 'Job', label: 'Job', category: 'Job' },
  { id: 'Examination', label: 'Examination', category: 'Examination' },
  { id: 'Academics', label: 'Academics', category: 'Academics' },
  { id: 'Finance', label: 'Finance', category: 'Finance' },
];

function getDateGroupLabel(isoDate) {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'TODAY';
  if (isSameDay(date, yesterday)) return 'YESTERDAY';
  return 'OLDER';
}

function formatRelativeTime(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;

  return new Date(isoDate).toLocaleDateString('en-IN', {
    weekday: diffHours < 24 * 7 ? 'long' : undefined,
    hour: 'numeric',
    minute: '2-digit',
  });
}

function NotificationDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(notificationData);
  const [preferences, setPreferences] = useState(notificationPreferenceData);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.isUnread).length,
    [notifications]
  );

  // Badge counts are derived from live data rather than hardcoded, so they
  // stay correct once `notifications` is populated from a real API call.
  const tabs = useMemo(
    () =>
      TAB_CONFIG.map((tab) => ({
        id: tab.id,
        label: tab.label,
        count: tab.category
          ? notifications.filter((notification) => notification.category === tab.category).length
          : notifications.length,
      })),
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    const activeCategory = TAB_CONFIG.find((tab) => tab.id === activeTab)?.category ?? null;
    const query = searchValue.trim().toLowerCase();

    return notifications
      .filter((notification) => !activeCategory || notification.category === activeCategory)
      .filter((notification) => {
        if (!query) return true;
        return (
          notification.title.toLowerCase().includes(query) ||
          notification.category.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, activeTab, searchValue]);

  const groupedNotifications = useMemo(() => {
    const groups = { TODAY: [], YESTERDAY: [], OLDER: [] };

    filteredNotifications.forEach((notification) => {
      groups[getDateGroupLabel(notification.createdAt)].push(notification);
    });

    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filteredNotifications]);

  // Marks a notification as read AND, if it has a `link`, routes the user
  // to the relevant dashboard page (e.g. an Examination notification opens
  // Assessments). System notices with no `link` just mark as read in place.
  const handleNotificationClick = (id) => {
    const notification = notifications.find((item) => item.id === id);

    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, isUnread: false } : item))
    );
    // TODO: PATCH /notifications/:id/read

    if (notification?.link) {
      navigate(notification.link);
    }
  };

  const handleTogglePreference = (id, enabled) => {
    setPreferences((current) =>
      current.map((preference) => (preference.id === id ? { ...preference, enabled } : preference))
    );
    // TODO: PATCH /notification-preferences
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        // orgLogoSrc={orgLogo}  -> pass the same logo asset other pages use
        activeItem="Notifications"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

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

          <div className={styles.grid}>
            <section className={styles.notificationColumn} aria-label="Notification list">
              {groupedNotifications.length === 0 && (
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
            </section>

            <aside className={styles.preferenceColumn} aria-label="Notification preferences">
              <NotificationPreference preferences={preferences} onToggle={handleTogglePreference} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NotificationDashboard;
