// src/components/candidatepage/Schedule/components/ScheduleList/ScheduleList.jsx
import PropTypes from "prop-types";
import { CalendarX2 } from "lucide-react";
import SectionHeading from "../../../shared/SectionHeading/SectionHeading";
import ScheduleCard from "../../../shared/ScheduleCard/ScheduleCard";
import EmptyState from "../../../shared/EmptyState/EmptyState";
import styles from "./ScheduleList.module.css";

/**
 * Renders one or more day-groups of classes. Each group gets a
 * SectionHeading and a stack of ScheduleCard components underneath it.
 * Falls back to an EmptyState when there is nothing to show.
 */
function ScheduleList({ days }) {
  if (!days.length) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="No classes scheduled"
        message="There is nothing on the schedule for this day yet."
      />
    );
  }

  return (
    <div className={styles.list}>
      {days.map((group) => (
        <section key={group.id} className={styles.group} aria-label={`${group.label} ${group.dateLabel}`}>
          <SectionHeading accent={group.label} label={group.dateLabel} />
          <div className={styles.cards}>
            {group.classes.map((item) => (
              <ScheduleCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

ScheduleList.propTypes = {
  days: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      dateLabel: PropTypes.string.isRequired,
      classes: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default ScheduleList;
