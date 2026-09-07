import React from "react";
import { ImagePlus, MapPin } from "lucide-react";
import StatusPill from "../../../shared/StatusPill/StatusPill";
import "./EventListView.css";

const STATUS_TONE = {
  Upcoming: "blue",
  Cancelled: "red",
  Completed: "green",
  Today: "amber",
};

/**
 * EventListView
 * Props:
 *  - events: array
 *  - onViewEvent: (event) => void — opens the event detail modal
 *  - onOpenMap: (event) => void — opens the event address in Google Maps
 *  - onUploadMedia: (event) => void
 */
export default function EventListView({
  events,
  onViewEvent,
  onOpenMap,
  onUploadMedia,
  pagination,
}) {
  return (
    <div className="el-card">
      <div className="el-scroll">
        <table className="el-table">
          <thead>
            <tr>
              <th>Job Fair</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="el-table__title">{event.title}</td>
                <td>{event.date}</td>
                <td>{event.venue}</td>
                <td>
                  <StatusPill
                    status={event.status}
                    tone={STATUS_TONE[event.status] || "gray"}
                  />
                </td>
                <td>
                  <div className="el-table__actions">
                    <button
                      type="button"
                      className="el-view-btn"
                      onClick={() => onViewEvent?.(event)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="el-map-btn"
                      onClick={() => onOpenMap?.(event)}
                    >
                      <MapPin size={13} />
                      Map
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
          onClick={pagination?.onPrev}
          disabled={!pagination || pagination.page === 1}
          aria-label="Previous page"
        >
          &lt;
        </button>
        <button
          type="button"
          className="el-pagination__btn"
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
