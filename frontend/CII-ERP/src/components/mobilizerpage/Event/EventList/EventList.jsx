import React, { useState } from 'react';
import EventListRow from '../EventListRow/EventListRow';
import './EventList.css';

const PAGE_SIZE = 4;

/**
 * EventList
 * Props:
 *  - events: array (already filtered by tab/search)
 *  - onUploadMedia: (event) => void
 */
export default function EventList({ events, onUploadMedia }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageEvents = events.slice(start, start + PAGE_SIZE);

  return (
    <div className="evl-card">
      <div className="evl-rows">
        {pageEvents.map((event) => (
          <EventListRow key={event.id} event={event} onUploadMedia={onUploadMedia} />
        ))}
        {pageEvents.length === 0 && <p className="evl-empty">No events match your filters.</p>}
      </div>

      <div className="evl-pagination">
        <button
          type="button"
          className="evl-pagination__btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={safePage === 1}
          aria-label="Previous page"
        >
          &lt;
        </button>
        <button
          type="button"
          className="evl-pagination__btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage === totalPages}
          aria-label="Next page"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
