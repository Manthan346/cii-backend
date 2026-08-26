import React from 'react';
import { X, Briefcase } from 'lucide-react';
import Modal from '../../../shared/Modal/Modal';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import './JobFairDetailModal.css';

const STATUS_TONE = {
  Completed: 'green',
  Upcoming: 'blue',
  Today: 'amber',
  Cancelled: 'red',
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
 * JobFairDetailModal
 * Opens from a JobFairCard's eye icon. Body content depends entirely on
 * `event.status`:
 *  - Completed: 2-column grid of 6 stat tiles from event.stats
 *  - Upcoming / Today: empty state ("No data yet for this Job Fair") —
 *      Today reuses the Upcoming copy since the event hasn't concluded
 *      yet either, so there's no results data to show regardless
 *  - Cancelled: empty state ("No data for this Job Fair") + red notice
 *
 * Props:
 *  - event: job fair object, or null when closed
 *  - onClose: () => void
 */
export default function JobFairDetailModal({ event, onClose }) {
  const isOpen = Boolean(event);

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={560}>
      {event && (
        <div className="jd-modal">
          <button type="button" className="jd-modal__close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>

          <div className="jd-modal__header">
            <div>
              <p className="jd-modal__date">{event.date}</p>
              <p className="jd-modal__location">{event.location}</p>
            </div>
            <StatusPill status={event.status} tone={STATUS_TONE[event.status] || 'gray'} />
          </div>

          {event.status === 'Completed' && event.stats ? (
            <div className="jd-stats-grid">
              {STAT_TILES.map((tile) => (
                <div className="jd-stat-tile" key={tile.key}>
                  <span className="jd-stat-tile__value">{event.stats[tile.key]}</span>
                  <span className="jd-stat-tile__label">{tile.label}</span>
                  <span className={`jd-stat-tile__bar jd-stat-tile__bar--${tile.tone}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="jd-empty">
              <span className="jd-empty__icon">
                <Briefcase size={20} />
              </span>
              {event.status === 'Cancelled' ? (
                <>
                  <p className="jd-empty__title">No data for this Job Fair</p>
                  <p className="jd-empty__notice">
                    <strong>NOTICE:</strong> This Job Fair event has been cancelled
                  </p>
                </>
              ) : (
                <>
                  <p className="jd-empty__title">No data yet for this Job Fair</p>
                  <p className="jd-empty__subtext">
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
