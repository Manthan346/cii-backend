import React from 'react';
import { Eye } from 'lucide-react';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import './JobFairCard.css';

const STATUS_TONE = {
  Completed: 'green',
  Upcoming: 'blue',
  Today: 'amber',
  Cancelled: 'red',
};

/**
 * JobFairCard
 * Props:
 *  - event: { date, location, status }
 *  - onView: (event) => void — fired by the eye icon
 */
export default function JobFairCard({ event, onView }) {
  return (
    <div className="jf-card">
      <div className="jf-card__top">
        <span className="jf-card__date">{event.date}</span>
        <button type="button" className="jf-card__eye" onClick={() => onView?.(event)} aria-label={`View ${event.date}`}>
          <Eye size={16} />
        </button>
      </div>
      <p className="jf-card__location">{event.location}</p>
      <StatusPill status={event.status} tone={STATUS_TONE[event.status] || 'gray'} />
    </div>
  );
}
