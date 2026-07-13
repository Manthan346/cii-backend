// src/components/candidatepage/shared/EmptyState/EmptyState.jsx
import PropTypes from "prop-types";
import { CalendarX2 } from "lucide-react";
import styles from "./EmptyState.module.css";

/**
 * Generic empty state, e.g. shown when a selected day has no classes.
 */
function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className={styles.wrap} role="status">
      <Icon size={28} className={styles.icon} aria-hidden="true" />
      <p className={styles.title}>{title}</p>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
};

EmptyState.defaultProps = {
  icon: CalendarX2,
  message: "",
};

export default EmptyState;
