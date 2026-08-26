import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../shared";
import { fetchCoursesAndBatches } from "../../../../../../api/trainer/candidateService";
import "./CreateEventModal.css";

const TARGET_TYPE_OPTIONS = [
  { label: "All active batches", value: "ALL_BATCHES" },
  { label: "All completed batches", value: "COMPLETED" },
  { label: "All batches (active + completed)", value: "A_C_BATCHES" },
];

export default function CreateEventModal({
  typeOptions = [],
  modeOptions = [],
  initialValues,
  onCancel,
  onSave,
}) {
  const isEdit = Boolean(initialValues);
  const [title, setTitle] = useState(initialValues?.title || "");
  const [type, setType] = useState(initialValues?.type || typeOptions[0] || "");
  const [mode, setMode] = useState(
    initialValues?.mode || modeOptions[0] || "Offline",
  );

  function toDateInputValue(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  function toTimeInputValue(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  }

  const [date, setDate] = useState(toDateInputValue(initialValues?.date) || "");
  const [time, setTime] = useState(toTimeInputValue(initialValues?.time) || "");
  const [venue, setVenue] = useState(initialValues?.venue || "");
  const [eventLink, setEventLink] = useState(initialValues?.eventLink || "");
  const [targetType, setTargetType] = useState(
    initialValues?.targetType || "ALL_BATCHES",
  );
  const [description, setDescription] = useState(
    initialValues?.description || "",
  );

  const modeUpper = mode.toUpperCase();
  const venueRequired = modeUpper === "OFFLINE" || modeUpper === "HYBRID";
  const linkRequired = modeUpper === "ONLINE" || modeUpper === "HYBRID";

  const isValid =
    title.trim().length > 0 &&
    date.trim().length > 0 &&
    time.trim().length > 0 &&
    description.trim().length > 0 &&
    (!venueRequired || venue.trim().length > 0) &&
    (!linkRequired || eventLink.trim().length > 0);

  const handleSave = () => {
    if (!isValid) return;
    onSave?.({
      title: title.trim(),
      type,
      mode,
      date,
      time: time.trim(),
      venue: venue.trim(),
      eventLink: eventLink.trim(),
      description: description.trim(),
      targetType,
    });
  };

  return (
    <div
      className={"events-create-event-modal-overlay"}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit event" : "Create event"}
    >
      <div className={"events-create-event-modal-modal"}>
        <div className={"events-create-event-modal-header"}>
          <h2 className={"events-create-event-modal-title"}>
            {isEdit ? "Edit Event" : "Create Event"}
          </h2>
          <button
            type="button"
            className={"events-create-event-modal-close-btn"}
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className={"events-create-event-modal-field"}>
          <label className={"events-create-event-modal-label"}>
            Event title{" "}
            <span className={"events-create-event-modal-required"}>*</span>
          </label>
          <input
            type="text"
            className={"events-create-event-modal-input"}
            placeholder="eg AI in Industry - Seminar"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={"events-create-event-modal-row"}>
          <div className={"events-create-event-modal-field"}>
            <label className={"events-create-event-modal-label"}>
              Event type
            </label>
            <select
              className={"events-create-event-modal-select"}
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={"events-create-event-modal-field"}>
            <label className={"events-create-event-modal-label"}>Mode</label>
            <select
              className={"events-create-event-modal-select"}
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              {modeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={"events-create-event-modal-row"}>
          <div className={"events-create-event-modal-field"}>
            <label className={"events-create-event-modal-label"}>
              Date{" "}
              <span className={"events-create-event-modal-required"}>*</span>
            </label>
            <input
              type="date"
              className={"events-create-event-modal-input"}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className={"events-create-event-modal-field"}>
            <label className={"events-create-event-modal-label"}>
              Time{" "}
              <span className={"events-create-event-modal-required"}>*</span>
            </label>
            <input
              type="time"
              className={"events-create-event-modal-input"}
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <div className={"events-create-event-modal-row"}>
          <div className={"events-create-event-modal-field"}>
            <label className={"events-create-event-modal-label"}>
              Venue
              {venueRequired && (
                <span className={"events-create-event-modal-required"}> *</span>
              )}
            </label>
            <input
              type="text"
              className={"events-create-event-modal-input"}
              placeholder="eg CII Auditorium, Mumbai"
              value={venue}
              onChange={(event) => setVenue(event.target.value)}
            />
          </div>

          <div className={"events-create-event-modal-field"}>
            <label className={"events-create-event-modal-label"}>
              Meeting link
              {linkRequired && (
                <span className={"events-create-event-modal-required"}> *</span>
              )}
            </label>
            <input
              type="text"
              className={"events-create-event-modal-input"}
              placeholder="eg https://zoom.us/j/..."
              value={eventLink}
              onChange={(event) => setEventLink(event.target.value)}
            />
          </div>
        </div>

        <div className={"events-create-event-modal-field"}>
          <label className={"events-create-event-modal-label"}>
            Who is this event for?
          </label>
          <select
            className={"events-create-event-modal-select"}
            value={targetType}
            onChange={(event) => setTargetType(event.target.value)}
          >
            {TARGET_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={"events-create-event-modal-field"}>
          <label className={"events-create-event-modal-label"}>
            Description{" "}
            <span className={"events-create-event-modal-required"}>*</span>
          </label>
          <textarea
            className={"events-create-event-modal-textarea"}
            rows={3}
            placeholder="Short description shown to candidates when they view this event"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={"events-create-event-modal-actions"}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!isValid}>
            {isEdit ? "Save changes" : "Create event"}
          </Button>
        </div>
      </div>
    </div>
  );
}
