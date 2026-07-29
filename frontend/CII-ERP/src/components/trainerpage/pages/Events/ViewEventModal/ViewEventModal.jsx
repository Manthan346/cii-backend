import { X, CalendarClock } from 'lucide-react';
import { StatusBadge, Avatar } from '../../../shared';
import './ViewEventModal.css';

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
    <div
      className={'overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Event details"
    >
      <div className={'modal'}>
        <button
          type="button"
          className={'closeBtn'}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={'header'}>
          <span className={'iconBadge'}>
            <CalendarClock size={22} />
          </span>
          <div className={'headerText'}>
            <h2 className={'name'}>{event.title}</h2>
            <p className={'type'}>{event.type}</p>
          </div>
          <StatusBadge status={event.status} />
        </div>

        <div className={'grid'}>
          <div className={'field'}>
            <span className={'label'}>Date &amp; time</span>
            <span className={'value'}>
              {event.date} &middot; {event.time}
            </span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Mode</span>
            <span className={'value'}>{event.mode}</span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Venue</span>
            <span className={'value'}>{event.venue}</span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Batch</span>
            <span className={'value'}>{event.batch}</span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Participants</span>
            <span className={'value'}>
              {event.participants}/{event.maxParticipants}
            </span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Organizer</span>
            <span className={'organizerValue'}>
              <Avatar name={event.organizer} tone="teal" size={22} />
              {event.organizer}
            </span>
          </div>
        </div>

        {event.description && (
          <div className={'descriptionField'}>
            <span className={'label'}>Description</span>
            <p className={'description'}>{event.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
