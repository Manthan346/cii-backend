import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import './EventListView.css';

const STATUS_TONE = {
  Upcoming: 'blue',
  Cancelled: 'red',
  Completed: 'green',
  Today: 'amber',
};

const PAGE_SIZE = 4;

/**
 * EventListView
 * Props:
 *  - events: array
 *  - onOpenWorkspace: (event) => void
 *  - onUploadMedia: (event) => void
 */
export default function EventListView({ events, onOpenWorkspace, onUploadMedia }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageEvents = events.slice(start, start + PAGE_SIZE);

  return (
    <div className="el-card">
      <div className="el-scroll">
        <table className="el-table">
          <thead>
            <tr>
              <th>Job Fair</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Expected</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageEvents.map((event) => (
              <tr key={event.id}>
                <td className="el-table__title">{event.title}</td>
                <td>{event.date}</td>
                <td>{event.venue}</td>
                <td>{event.expectedCandidates}</td>
                <td>
                  <StatusPill status={event.status} tone={STATUS_TONE[event.status] || 'gray'} />
                </td>
                <td>
                  <div className="el-table__actions">
                    <button type="button" className="el-open-btn" onClick={() => onOpenWorkspace?.(event)}>
                      Open
                    </button>
                    <button
                      type="button"
                      className="el-upload-btn"
                      onClick={() => onUploadMedia?.(event)}
                      aria-label="Upload images or video"
                    >
                      <ImagePlus size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="el-pagination">
        <button
          type="button"
          className="el-pagination__btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={safePage === 1}
          aria-label="Previous page"
        >
          &lt;
        </button>
        <button
          type="button"
          className="el-pagination__btn"
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
