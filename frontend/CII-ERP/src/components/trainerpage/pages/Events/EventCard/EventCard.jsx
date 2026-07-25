import { CalendarDays, Clock, MapPin } from "lucide-react";
import styles from "./EventCard.module.css";

/**
 * EventCard (Events)
 *
 * One tile in the "Upcoming events" highlight row on the Events page:
 * type badge, title, date/time, and venue. Page-local since this exact
 * highlight-tile shape only appears on this page (same pattern as
 * Work's ShortcutCard / Resources' QuickAccessCard).
 *
 * Props:
 *  - title: string    -> event name
 *  - type: string     -> Seminar | Workshop | Webinar | Conference | Meetup
 *  - date: string     -> display date, e.g. "02 Aug 2026"
 *  - time: string     -> display time range
 *  - venue: string    -> location or online link label
 *  - tone: string     -> "teal" | "blue" | "mint", controls the badge color
 *  - onClick: function
 */
export default function EventCard({ title, type, date, time, venue, tone = "teal", onClick }) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <span className={`${styles.typeBadge} ${styles[`typeBadge--${tone}`]}`}>{type}</span>

      <h3 className={styles.title}>{title}</h3>

      <div className={styles.metaRow}>
        <CalendarDays size={14} className={styles.metaIcon} />
        <span>{date}</span>
      </div>
      <div className={styles.metaRow}>
        <Clock size={14} className={styles.metaIcon} />
        <span>{time}</span>
      </div>
      <div className={styles.metaRow}>
        <MapPin size={14} className={styles.metaIcon} />
        <span className={styles.venue}>{venue}</span>
      </div>
    </button>
  );
}
