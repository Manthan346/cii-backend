import React from 'react';
import { Calendar, MapPin, Users, User, ImagePlus } from 'lucide-react';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import './EventCard.css';

const STATUS_TONE = {
  Upcoming: 'blue',
  Cancelled: 'red',
  Completed: 'green',
  Today: 'amber',
};

/**
 * EventCard
 * Props:
 *  - event: placement event object
 *  - onOpenWorkspace: (event) => void — "Open Workspace" button
 *  - onUploadMedia: (event) => void — the small image icon button
 */
export default function EventCard({ event, onOpenWorkspace, onUploadMedia }) {
  return (
    <div className="ev-card">
      <div className="ev-card__top">
        <h3 className="ev-card__title">{event.title}</h3>
        <StatusPill status={event.status} tone={STATUS_TONE[event.status] || 'gray'} />
      </div>

      <div className="ev-card__row">
        <Calendar size={15} className="ev-card__icon" />
        <span>
          {event.date} . {event.time}
        </span>
      </div>

      <div className="ev-card__row">
        <MapPin size={15} className="ev-card__icon" />
        <span>{event.address}</span>
      </div>

      <div className="ev-card__row">
        <Users size={15} className="ev-card__icon" />
        <span>Expected: {event.expectedCandidates} candidates</span>
      </div>

      <div className="ev-card__row">
        <User size={15} className="ev-card__icon" />
        <span>{event.organizers.join(', ')}</span>
      </div>

      <div className="ev-card__footer">
        <button type="button" className="ev-open-btn" onClick={() => onOpenWorkspace?.(event)}>
          Open Workspace
        </button>
        <button type="button" className="ev-map-btn">
          <MapPin size={13} />
          Map
        </button>
        <button
          type="button"
          className="ev-upload-btn"
          onClick={() => onUploadMedia?.(event)}
          aria-label="Upload images or video"
        >
          <ImagePlus size={15} />
        </button>
      </div>
    </div>
  );
}
