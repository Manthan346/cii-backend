import "./ProfileTabs.css";

/**
 * ProfileTabs
 *
 * Full-width, equal-width tab strip under the Profile hero card.
 * Layout/behaviour is specific to this page, so it lives inside
 * pages/Profile rather than /shared - same convention as
 * NotificationTabs living inside pages/Notifications.
 */
export default function ProfileTabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="profile-tabs">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={`profile-tabs__pill${isActive ? " profile-tabs__pill--active" : ""}`}
            onClick={() => onChange?.(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
