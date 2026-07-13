// src/components/candidatepage/Schedule/components/WeekSelector/WeekSelector.jsx
import PropTypes from "prop-types";
import styles from "./WeekSelector.module.css";

function statusLabel(count) {
  if (count === 0) return "No classes";
  return count === 1 ? "1 class" : `${count} classes`;
}

/**
 * Horizontal week calendar strip. Selection is fully controlled by the
 * parent via `selectedId` / `onSelect` — this component holds no state
 * of its own so the selected day can be driven from anywhere (URL, API
 * default, etc.) in the future.
 */
function WeekSelector({ days, selectedId, onSelect }) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="Select a day">
      {days.map((day) => {
        const isSelected = day.id === selectedId;
        return (
          <button
            key={day.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`${day.day} ${day.date}, ${statusLabel(day.classCount)}`}
            className={`${styles.dayCard} ${isSelected ? styles.selected : ""}`}
            onClick={() => onSelect(day.id)}
          >
            <span className={styles.dayLabel}>{day.day}</span>
            <span className={styles.dateLabel}>{day.date}</span>
            <span className={styles.statusLabel}>{statusLabel(day.classCount)}</span>
          </button>
        );
      })}
    </div>
  );
}

WeekSelector.propTypes = {
  days: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      classCount: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

WeekSelector.defaultProps = {
  selectedId: null,
};

export default WeekSelector;
