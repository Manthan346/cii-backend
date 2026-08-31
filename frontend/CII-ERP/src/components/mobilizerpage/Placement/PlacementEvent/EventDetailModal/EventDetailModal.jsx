import React, { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../../shared/Modal/Modal";
import StatusPill from "../../../shared/StatusPill/StatusPill";
import "./EventDetailModal.css";

const STATUS_TONE = {
  Upcoming: "blue",
  Cancelled: "red",
  Completed: "green",
  Today: "amber",
};

/**
 * EventDetailModal
 * Matches the style of the public Events detail modal so a user can view
 * the full job fair/drive details returned by the backend API.
 */
export default function EventDetailModal({ event, onClose, onOpenUpload }) {
  const isOpen = Boolean(event);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={560}>
      {event && (
        <div className="ed-modal">
          <button
            type="button"
            className="ed-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="ed-modal__header">
            <div>
              <p className="ed-modal__date">{event.title}</p>
              <p className="ed-modal__location">
                {event.date} · {event.time}
              </p>
              <p className="ed-modal__venue">{event.venue}</p>
            </div>
            <StatusPill
              status={event.status}
              tone={STATUS_TONE[event.status] || "gray"}
            />
          </div>

          <div className="ed-detail-list">
            <div className="ed-detail-row">
              <span className="ed-detail-row__label">Event type</span>
              <span className="ed-detail-row__value">{event.type || "-"}</span>
            </div>

            <div className="ed-detail-row">
              <span className="ed-detail-row__label">Description</span>
              <span className="ed-detail-row__value">
                {event.description || "-"}
              </span>
            </div>

            <div className="ed-detail-row">
              <span className="ed-detail-row__label">Created by</span>
              <span className="ed-detail-row__value">
                {event.createdByName || "HR"}
              </span>
            </div>
          </div>

          <div className="ed-images-section">
            <h3>Event images</h3>
            {event.images?.length ? (
              <div className="ed-image-grid">
                {event.images.map((image, index) => {
                  const imageUrl =
                    typeof image === "string"
                      ? image
                      : image?.url || image?.secure_url || "";
                  if (!imageUrl) return null;
                  return (
                    <button
                      type="button"
                      className="ed-image-button"
                      key={imageUrl || index}
                      onClick={() => setSelectedImage(imageUrl)}
                      aria-label={`View ${event.title} image ${index + 1}`}
                    >
                      <img src={imageUrl} alt={`${event.title} ${index + 1}`} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="ed-no-images">No images uploaded.</p>
            )}
          </div>

          {event.status === "Completed" && (
            <button
              type="button"
              className="ed-add-media-btn"
              onClick={() => onOpenUpload?.(event)}
            >
              Add Images &amp; video
            </button>
          )}

          {selectedImage && (
            <div
              className="ed-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Event image preview"
              onClick={() => setSelectedImage(null)}
            >
              <button
                type="button"
                className="ed-lightbox__close"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image preview"
              >
                <X size={22} />
              </button>
              <img
                src={selectedImage}
                alt={`${event.title} full screen`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
