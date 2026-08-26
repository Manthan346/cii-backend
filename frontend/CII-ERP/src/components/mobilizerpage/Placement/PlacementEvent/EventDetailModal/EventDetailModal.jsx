import React from 'react';
import { X, Briefcase } from 'lucide-react';
import Modal from '../../../shared/Modal/Modal';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import './EventDetailModal.css';

const STATUS_TONE = {
  Upcoming: 'blue',
  Cancelled: 'red',
  Completed: 'green',
  Today: 'amber',
};

const STAT_TILES = [
  { key: 'enrolled', label: 'Total Enrolled Candidates', tone: 'blue' },
  { key: 'registered', label: 'Total Registered Candidates', tone: 'purple' },
  { key: 'attended', label: 'Total Attended', tone: 'green' },
  { key: 'interviewCompleted', label: 'Interview Completed', tone: 'amber' },
  { key: 'selected', label: 'Selected candidates', tone: 'amber' },
  { key: 'rejected', label: 'Rejected Candidates', tone: 'blue' },
];

/**
 * EventDetailModal
 * Opens from "Open Workspace" (card view) or "Open" (list view). Body
 * content depends on event.status, same pattern as the Placement
 * Dashboard's job fair popup — Today reuses the Upcoming empty state for
 * the same reason (event hasn't concluded, so no results yet either way).
 *
 * The "Add Images & video" button only shows for Completed events (the
 * only state your reference screenshot showed it in) and hands off to
 * the same upload modal as the card's image icon.
 *
 * Props:
 *  - event: placement event object, or null when closed
 *  - onClose: () => void
 *  - onOpenUpload: (event) => void
 */
export default function EventDetailModal({ event, onClose, onOpenUpload }) {
  const isOpen = Boolean(event);

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={560}>
      {event && (
        <div className="ed-modal">
          <button type="button" className="ed-modal__close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>

          <div className="ed-modal__header">
            <div>
              <p className="ed-modal__date">{event.date}</p>
              <p className="ed-modal__location">{event.venue}</p>
            </div>
            <StatusPill status={event.status} tone={STATUS_TONE[event.status] || 'gray'} />
          </div>

          {event.status === 'Completed' && event.stats ? (
            <>
              <div className="ed-stats-grid">
                {STAT_TILES.map((tile) => (
                  <div className="ed-stat-tile" key={tile.key}>
                    <span className="ed-stat-tile__value">{event.stats[tile.key]}</span>
                    <span className="ed-stat-tile__label">{tile.label}</span>
                    <span className={`ed-stat-tile__bar ed-stat-tile__bar--${tile.tone}`} />
                  </div>
                ))}
              </div>

              <button type="button" className="ed-add-media-btn" onClick={() => onOpenUpload?.(event)}>
                Add Images &amp; video
              </button>
            </>
          ) : (
            <div className="ed-empty">
              <span className="ed-empty__icon">
                <Briefcase size={20} />
              </span>
              {event.status === 'Cancelled' ? (
                <>
                  <p className="ed-empty__title">No data for this Job Fair</p>
                  <p className="ed-empty__notice">
                    <strong>NOTICE:</strong> This Job Fair event has been cancelled
                  </p>
                </>
              ) : (
                <>
                  <p className="ed-empty__title">No data yet for this Job Fair</p>
                  <p className="ed-empty__subtext">
                    Total enrolled, total registration, attended, interview completed, selected, and
                    rejected data will appear here.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
