import styles from './NotificationTabs.module.css';

/**
 * NotificationTabs
 * A row of pill-shaped, keyboard-navigable tabs with badge counts.
 *
 * Props:
 * - tabs: [{ id, label, count }]
 * - activeTab: string          -> id of the active tab
 * - onTabChange: (id) => void
 */
function NotificationTabs({ tabs, activeTab, onTabChange }) {
  const handleKeyDown = (event, index) => {
    const isArrowRight = event.key === 'ArrowRight';
    const isArrowLeft = event.key === 'ArrowLeft';

    if (!isArrowRight && !isArrowLeft) return;

    event.preventDefault();
    const nextIndex = isArrowRight
      ? (index + 1) % tabs.length
      : (index - 1 + tabs.length) % tabs.length;

    const nextTab = tabs[nextIndex];
    onTabChange(nextTab.id);
    document.getElementById(`notification-tab-${nextTab.id}`)?.focus();
  };

  return (
    <div className={styles.tabList} role="tablist" aria-label="Notification categories">
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            id={`notification-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className={styles.tabLabel}>{tab.label}</span>
            <span className={styles.tabCount}>{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default NotificationTabs;
