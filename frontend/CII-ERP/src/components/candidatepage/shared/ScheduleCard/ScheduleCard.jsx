// src/components/candidatepage/shared/ScheduleCard/ScheduleCard.jsx
import PropTypes from "prop-types";
import { Video, MapPin, User, Radio } from "lucide-react";
import styles from "./ScheduleCard.module.css";

/**
 * Renders a single scheduled class. Supports Online, Offline, and Hybrid
 * modes without any changes to the component — the right icon/label pair
 * is derived from the `mode` prop.
 */
function ScheduleCard({ time, period, title, subject, mode, location, mentor, status }) {
  const modeConfig = getModeConfig(mode);

  return (
    <article className={styles.card} data-status={status}>
      <div className={styles.timeBadge} aria-hidden="true">
        <span className={styles.time}>{time}</span>
        <span className={styles.period}>{period}</span>
      </div>

      <div className={styles.body}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.subject}>{subject}</p>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <modeConfig.Icon size={14} aria-hidden="true" />
            {modeConfig.label}
          </span>

          {location && (
            <span className={styles.metaItem}>
              <MapPin size={14} aria-hidden="true" />
              {location}
            </span>
          )}

          {mentor && (
            <span className={styles.metaItem}>
              <User size={14} aria-hidden="true" />
              {mentor}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function getModeConfig(mode) {
  switch ((mode || "").toLowerCase()) {
    case "online":
      return { Icon: Video, label: "Online" };
    case "hybrid":
      return { Icon: Radio, label: "Hybrid" };
    case "offline":
    default:
      return { Icon: MapPin, label: "Offline" };
  }
}

ScheduleCard.propTypes = {
  time: PropTypes.string.isRequired,
  period: PropTypes.string,
  title: PropTypes.string.isRequired,
  subject: PropTypes.string,
  mode: PropTypes.oneOf(["Online", "Offline", "Hybrid"]).isRequired,
  location: PropTypes.string,
  mentor: PropTypes.string,
  status: PropTypes.string,
};

ScheduleCard.defaultProps = {
  period: "",
  subject: "",
  location: null,
  mentor: null,
  status: "upcoming",
};

export default ScheduleCard;
