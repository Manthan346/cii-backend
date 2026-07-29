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
    <button type="button" className={'card'} onClick={onClick}>
      <span className={`${'typeBadge'} ${`typeBadge--${tone}`}`}>{type}</span>

      <h3 className={'title'}>{title}</h3>

      <div className={'metaRow'}>
        <CalendarDays size={14} className={'metaIcon'} />
        <span>{date}</span>
      </div>
      <div className={'metaRow'}>
        <Clock size={14} className={'metaIcon'} />
        <span>{time}</span>
      </div>
      <div className={'metaRow'}>
        <MapPin size={14} className={'metaIcon'} />
        <span className={'venue'}>{venue}</span>
      </div>
    </button>
  );
}
