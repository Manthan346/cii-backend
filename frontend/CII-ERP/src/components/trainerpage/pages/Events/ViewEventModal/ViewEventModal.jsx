import { X, CalendarClock } from "lucide-react";
import { StatusBadge, Avatar } from "../../../shared";
import styles from "./ViewEventModal.module.css";

/**
 * ViewEventModal (Events)
 *
 * Short popup opened by the Eye icon in the event table's Action
 * column. Shows all of an event's details in one place, including the
 * description that doesn't fit in the table row.
 */
export default function ViewEventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Event details">
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        <div className={styles.header}>
          <span className={styles.iconBadge}>
            <CalendarClock size={22} />
          </span>
          <div className={styles.headerText}>
            <h2 className={styles.name}>{event.title}</h2>
            <p className={styles.type}>{event.type}</p>
          </div>
          <StatusBadge status={event.status} />
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Date &amp; time</span>
            <span className={styles.value}>
              {event.date} &middot; {event.time}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Mode</span>
            <span className={styles.value}>{event.mode}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Venue</span>
            <span className={styles.value}>{event.venue}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Batch</span>
            <span className={styles.value}>{event.batch}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Participants</span>
            <span className={styles.value}>
              {event.participants}/{event.maxParticipants}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Organizer</span>
            <span className={styles.organizerValue}>
              <Avatar name={event.organizer} tone="teal" size={22} />
              {event.organizer}
            </span>
          </div>
        </div>

        {event.description && (
          <div className={styles.descriptionField}>
            <span className={styles.label}>Description</span>
            <p className={styles.description}>{event.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
