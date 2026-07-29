import { CalendarDays, Clock, MapPin } from 'lucide-react';
import './EventCard.css';

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
export default function EventCard({
  title,
  type,
  date,
  time,
  venue,
  tone = 'teal',
  onClick,
}) {
  return (
    <button
      type="button"
      className={'events-event-card-card'}
      onClick={onClick}
    >
      <span
        className={`events-event-card-type-badge events-event-card-type-badge--${tone}`}
      >
        {type}
      </span>

      <h3 className={'events-event-card-title'}>{title}</h3>

      <div className={'events-event-card-meta-row'}>
        <CalendarDays size={14} className={'events-event-card-meta-icon'} />
        <span>{date}</span>
      </div>
      <div className={'events-event-card-meta-row'}>
        <Clock size={14} className={'events-event-card-meta-icon'} />
        <span>{time}</span>
      </div>
      <div className={'events-event-card-meta-row'}>
        <MapPin size={14} className={'events-event-card-meta-icon'} />
        <span className={'events-event-card-venue'}>{venue}</span>
      </div>
    </button>
  );
}
