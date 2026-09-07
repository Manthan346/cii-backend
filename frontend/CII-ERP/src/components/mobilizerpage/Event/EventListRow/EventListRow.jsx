import React from 'react';
import { ImagePlus } from 'lucide-react';
import StatusPill from '../../shared/StatusPill/StatusPill';
import './EventListRow.css';

// This page's "Upcoming" pill is gray in the reference (unlike the blue
// used elsewhere) — 'Ongoing' has no reference example, so blue was the
// closest reasonable fit.
const STATUS_TONE = {
  Upcoming: 'gray',
  Ongoing: 'blue',
  Completed: 'green',
};

/**
 * EventListRow
 * Props:
 *  - event: event object
 *  - onUploadMedia: (event) => void — the image icon button
 */
export default function EventListRow({ event, onViewEvent, onUploadMedia }) {
  const status = event.event_status
    ? String(event.event_status)
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : event.status;

  return (
    <div className="evr-row">
      <div className="evr-date">
        <span className="evr-date__day">{event.day}</span>
        <span className="evr-date__month">{event.month}</span>
      </div>

      <div className="evr-main">
        <div className="evr-main__title-line">
          <h3 className="evr-title">{event.title}</h3>
          <span className="evr-type-tag">{event.type}</span>
        </div>
        <p className="evr-time">{event.time}</p>
      </div>

      <div className="evr-actions">
        <button type="button" className="evr-view-btn" onClick={() => onViewEvent?.(event)}>View</button>
        <StatusPill status={status} tone={STATUS_TONE[status] || 'gray'} />
        <button
          type="button"
          className="evr-upload-btn"
          onClick={() => onUploadMedia?.(event)}
          aria-label="Upload images or video"
        >
          <ImagePlus size={15} />
        </button>
      </div>
    </div>
  );
}
