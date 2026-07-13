import styles from './NotificationPreference.module.css';

/**
 * NotificationPreference
 * Controlled panel of toggleable notification preferences.
 *
 * Props:
 * - preferences: [{ id, title, description, enabled }]
 * - onToggle: (id, nextEnabled) => void
 */
function NotificationPreference({ preferences, onToggle }) {
  return (
    <section className={styles.panel} aria-labelledby="notification-preferences-heading">
      <h2 id="notification-preferences-heading" className={styles.heading}>
        Notification Preferences
      </h2>

      <ul className={styles.list}>
        {preferences.map((preference) => (
          <li key={preference.id} className={styles.row}>
            <div className={styles.text}>
              <p className={styles.title}>{preference.title}</p>
              <p className={styles.description}>{preference.description}</p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preference.enabled}
              aria-label={preference.title}
              className={`${styles.toggle} ${preference.enabled ? styles.toggleOn : ''}`}
              onClick={() => onToggle(preference.id, !preference.enabled)}
            >
              <span className={styles.thumb} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NotificationPreference;
