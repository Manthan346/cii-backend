import React from 'react';
import EventListRow from '../EventListRow/EventListRow';
import './EventList.css';

/**
 * EventList
 * Props:
 *  - events: array (already filtered by tab/search)
 *  - onUploadMedia: (event) => void
 */
export default function EventList({ events, onViewEvent, onUploadMedia, pagination }) {

  return (
    <div className="evl-card">
      <div className="evl-rows">
        {events.map((event) => (
          <EventListRow key={event.id} event={event} onViewEvent={onViewEvent} onUploadMedia={onUploadMedia} />
        ))}
        {events.length === 0 && <p className="evl-empty">No events match your filters.</p>}
      </div>

      <div className="evl-pagination">
        <button
          type="button"
          className="evl-pagination__btn"
          onClick={pagination?.onPrev}
          disabled={!pagination || pagination.page === 1}
          aria-label="Previous page"
        >
          &lt;
        </button>
        <button
          type="button"
          className="evl-pagination__btn"
          onClick={pagination?.onNext}
          disabled={!pagination || pagination.page === pagination.totalPages}
          aria-label="Next page"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
