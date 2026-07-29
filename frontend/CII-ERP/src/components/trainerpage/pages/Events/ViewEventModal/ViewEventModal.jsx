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
      className={'events-view-event-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Event details"
    >
      <div className={'events-view-event-modal-modal'}>
        <button
          type="button"
          className={'events-view-event-modal-close-btn'}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={'events-view-event-modal-header'}>
          <span className={'events-view-event-modal-icon-badge'}>
            <CalendarClock size={22} />
          </span>
          <div className={'events-view-event-modal-header-text'}>
            <h2 className={'events-view-event-modal-name'}>{event.title}</h2>
            <p className={'events-view-event-modal-type'}>{event.type}</p>
          </div>
          <StatusBadge status={event.status} />
        </div>

        <div className={'events-view-event-modal-grid'}>
          <div className={'events-view-event-modal-field'}>
            <span className={'events-view-event-modal-label'}>
              Date &amp; time
            </span>
            <span className={'events-view-event-modal-value'}>
              {event.date} &middot; {event.time}
            </span>
          </div>
          <div className={'events-view-event-modal-field'}>
            <span className={'events-view-event-modal-label'}>Mode</span>
            <span className={'events-view-event-modal-value'}>
              {event.mode}
            </span>
          </div>
          <div className={'events-view-event-modal-field'}>
            <span className={'events-view-event-modal-label'}>Venue</span>
            <span className={'events-view-event-modal-value'}>
              {event.venue}
            </span>
          </div>
          <div className={'events-view-event-modal-field'}>
            <span className={'events-view-event-modal-label'}>Batch</span>
            <span className={'events-view-event-modal-value'}>
              {event.batch}
            </span>
          </div>
          <div className={'events-view-event-modal-field'}>
            <span className={'events-view-event-modal-label'}>
              Participants
            </span>
            <span className={'events-view-event-modal-value'}>
              {event.participants}/{event.maxParticipants}
            </span>
          </div>
          <div className={'events-view-event-modal-field'}>
            <span className={'events-view-event-modal-label'}>Organizer</span>
            <span className={'events-view-event-modal-organizer-value'}>
              <Avatar name={event.organizer} tone="teal" size={22} />
              {event.organizer}
            </span>
          </div>
        </div>

        {event.description && (
          <div className={'events-view-event-modal-description-field'}>
            <span className={'events-view-event-modal-label'}>Description</span>
            <p className={'events-view-event-modal-description'}>
              {event.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
