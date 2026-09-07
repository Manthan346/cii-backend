import React from "react";
import { Calendar, MapPin, ImagePlus } from "lucide-react";
import StatusPill from "../../../shared/StatusPill/StatusPill";
import "./EventCard.css";

const STATUS_TONE = {
  Upcoming: "blue",
  Cancelled: "red",
  Completed: "green",
  Today: "amber",
};

/**
 * EventCard
 * Props:
 *  - event: placement event object
 *  - onViewEvent: (event) => void — opens the event detail modal
 *  - onOpenMap: (event) => void — opens the event address in Google Maps
 *  - onUploadMedia: (event) => void — the small image icon button
 */
export default function EventCard({
  event,
  onViewEvent,
  onOpenMap,
  onUploadMedia,
}) {
  return (
    <div className="ev-card">
      <div className="ev-card__top">
        <h3 className="ev-card__title">{event.title}</h3>
        <StatusPill
          status={event.status}
          tone={STATUS_TONE[event.status] || "gray"}
        />
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

      <div className="ev-card__footer">
        <button
          type="button"
          className="ev-view-btn"
          onClick={() => onViewEvent?.(event)}
        >
          View
        </button>
        <button
          type="button"
          className="ev-map-btn"
          onClick={() => onOpenMap?.(event)}
        >
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
