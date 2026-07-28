import "./NotificationTabs.css";

/**
 * NotificationTabs
 *
 * Pill filter-tab row for the Notifications page ("All 18", "Unread 5",
 * "Task", "Resources", "System"). Layout/behaviour (active pill filled
 * teal, count badges) is specific to this page's filter bar, so it
 * lives inside pages/Notifications rather than /shared - same
 * convention as ShortcutCard/RecentActivity living inside pages/Work.
 */
export default function NotificationTabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="notification-tabs">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={`notification-tabs__pill${isActive ? " notification-tabs__pill--active" : ""}`}
            onClick={() => onChange?.(tab.id)}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`notification-tabs__count${
                  tab.id === "unread" ? " notification-tabs__count--red" : ""
                }${isActive ? " notification-tabs__count--active" : ""}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
