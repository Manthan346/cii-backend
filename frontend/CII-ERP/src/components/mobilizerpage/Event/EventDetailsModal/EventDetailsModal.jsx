import React, { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../shared/Modal/Modal";
import StatusPill from "../../shared/StatusPill/StatusPill";
import "./EventDetailsModal.css";

const STATUS_TONE = {
  Upcoming: "blue",
  Ongoing: "gray",
  Completed: "green",
};

export default function EventDetailsModal({
  event,
  creatorName,
  onClose,
  onEdit,
}) {
  const [selectedImage, setSelectedImage] = useState(null);

  const creator =
    [
      creatorName,
      event?.createdByName,
      event?.created_by_name,
      event?.created_by,
      event?.createdBy,
      event?.creator_name,
      event?.mobilizer_name,
      event?.created_by_user?.name,
      event?.createdByUser?.name,
      event?.user?.name,
      event?.mobilizer?.name,
    ]
      .map((value) =>
        typeof value === "object"
          ? value?.name ||
            value?.full_name ||
            [value?.first_name, value?.last_name].filter(Boolean).join(" ")
          : value,
      )
      .find(Boolean) || "Mobilizer";

  return (
    <Modal isOpen={Boolean(event)} onClose={onClose} width={560}>
      {event && (
        <div className="event-details-modal">
          <button
            type="button"
            className="event-details-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <div className="event-details-modal__header">
            <div>
              <h2>{event.title}</h2>
              <p>
                {event.date} · {event.time}
              </p>
              <p>{event.venue}</p>
            </div>
            <div className="event-details-modal__status">
              <StatusPill
                status={event.status}
                tone={STATUS_TONE[event.status] || "gray"}
              />
            </div>
          </div>
          <dl className="event-details-modal__details">
            <div>
              <dt>Event type</dt>
              <dd>{event.type || "-"}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{event.description || "-"}</dd>
            </div>
            <div>
              <dt>Created by</dt>
              <dd>{creator}</dd>
            </div>
          </dl>
          <div className="event-details-modal__images">
            <h3>Event images</h3>
            {event.images?.length ? (
              event.images.map((image, index) => {
                const imageUrl = image.url || image;
                return (
                  <button
                    type="button"
                    className="event-details-modal__image-button"
                    key={imageUrl || index}
                    onClick={() => setSelectedImage(imageUrl)}
                    aria-label={`View ${event.title} image ${index + 1}`}
                  >
                    <img src={imageUrl} alt={`${event.title} ${index + 1}`} />
                  </button>
                );
              })
            ) : (
              <p>No images uploaded.</p>
            )}
          </div>
          <button
            type="button"
            className="event-details-modal__edit"
            onClick={() => onEdit?.(event)}
          >
            Edit Event
          </button>
          {selectedImage && (
            <div
              className="event-details-modal__lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Event image preview"
              onClick={() => setSelectedImage(null)}
            >
              <button
                type="button"
                className="event-details-modal__lightbox-close"
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
