import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import Modal from "../../shared/Modal/Modal";
import "./AddEventModal.css";

const EVENT_TYPE_OPTIONS = [
  { value: "WEBINAR", label: "Webinar" },
  { value: "SEMINAR", label: "Seminar" },
  { value: "UPSKILLING", label: "Upskilling" },
  { value: "WORKSHOP", label: "Workshop" },
];

const EVENT_MODE_OPTIONS = [
  { value: "ONLINE", label: "Online" },
  { value: "OFFLINE", label: "Offline" },
  { value: "HYBRID", label: "Hybrid" },
];

const TARGET_TYPE_OPTIONS = [
  { value: "PUBLIC", label: "Public" },
  { value: "BATCH", label: "Batch" },
];

const EVENT_STATUS_OPTIONS = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
];

const EMPTY_FORM = {
  eventType: "",
  eventName: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  eventMode: "OFFLINE",
  targetType: "PUBLIC",
  eventStatus: "UPCOMING",
  venue: "",
  eventLink: "",
};

/**
 * AddEventModal
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onSubmit: (formValues) => void
 */
export default function AddEventModal({ event, isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (event) {
      setForm({
        ...EMPTY_FORM,
        eventName: event.title,
        eventType: event.type,
        date: event.rawDate || "",
        startTime: event.rawStartTime || event.rawTime || "",
        endTime: event.rawEndTime || "",
        eventMode: event.event_mode || "OFFLINE",
        targetType: event.target_type || "PUBLIC",
        eventStatus:
          event.event_status || event.status?.toUpperCase().replace(/ /g, "_") || "UPCOMING",
        venue: event.venue || "",
        eventLink: event.event_link || "",
        description: event.description || "",
      });
    } else setForm(EMPTY_FORM);
  }, [event]);

  const updateField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const updateTime = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    const time =
      digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
    setForm((f) => ({ ...f, startTime: time }));
  };

  const updateEndTime = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    const time =
      digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
    setForm((f) => ({ ...f, endTime: time }));
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    onClose();
  };

  const handleCreate = () => {
    if (
      !form.eventType ||
      !form.eventName ||
      !form.description ||
      !form.date ||
      !form.startTime ||
      !form.endTime ||
      !form.eventMode ||
      !form.targetType
    ) {
      setFormError("Please complete all required fields.");
      return;
    }
    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(form.startTime) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(form.endTime)
    ) {
      setFormError("Enter a valid time in 24-hour format (HH:MM).");
      return;
    }
    if (form.endTime <= form.startTime) {
      setFormError("End time must be after start time.");
      return;
    }
    if (["OFFLINE", "HYBRID"].includes(form.eventMode) && !form.venue) {
      setFormError("Venue is required for offline and hybrid events.");
      return;
    }
    if (["ONLINE", "HYBRID"].includes(form.eventMode) && !form.eventLink) {
      setFormError("Event link is required for online and hybrid events.");
      return;
    }
    setFormError("");
    onSubmit?.(form);
    setForm(EMPTY_FORM);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width={520}>
      <div className="ae-modal">
        <button
          type="button"
          className="ae-modal__close"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <label className="ae-field">
          <span className="ae-field__label">Event type</span>
          <span className="ae-select-wrap">
            <select value={form.eventType} onChange={updateField("eventType")}>
              <option value="" disabled>
                Select Event type
              </option>
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="ae-select__chevron" />
          </span>
        </label>

        {event && (
          <label className="ae-field">
            <span className="ae-field__label">Event Status</span>
            <span className="ae-select-wrap">
              <select
                required
                value={form.eventStatus}
                onChange={updateField("eventStatus")}
              >
                {EVENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="ae-select__chevron" />
            </span>
          </label>
        )}

        <label className="ae-field">
          <span className="ae-field__label">Event Title</span>
          <input
            type="text"
            maxLength={255}
            required
            value={form.eventName}
            onChange={updateField("eventName")}
          />
        </label>

        <label className="ae-field">
          <span className="ae-field__label">Event Description</span>
          <textarea
            required
            value={form.description}
            onChange={updateField("description")}
            rows={3}
          />
        </label>

        <div className="ae-modal__grid">
          <label className="ae-field">
            <span className="ae-field__label">Event Date</span>
            <input
              type="date"
              required
              value={form.date}
              onChange={updateField("date")}
            />
          </label>
          <label className="ae-field">
            <span className="ae-field__label">Event Time</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="HH:MM"
              maxLength={5}
              pattern="([01]\\d|2[0-3]):[0-5]\\d"
              required
              value={form.startTime}
              onChange={updateTime}
            />
          </label>
          <label className="ae-field">
            <span className="ae-field__label">Event End Time</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="HH:MM"
              maxLength={5}
              pattern="([01]\\d|2[0-3]):[0-5]\\d"
              required
              value={form.endTime}
              onChange={updateEndTime}
            />
          </label>
        </div>

        <div className="ae-modal__grid">
          <label className="ae-field">
            <span className="ae-field__label">Event Mode</span>
            <span className="ae-select-wrap">
              <select
                required
                value={form.eventMode}
                onChange={updateField("eventMode")}
              >
                {EVENT_MODE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="ae-select__chevron" />
            </span>
          </label>
          <label className="ae-field">
            <span className="ae-field__label">Target Type</span>
            <span className="ae-select-wrap">
              <select
                required
                value={form.targetType}
                onChange={updateField("targetType")}
              >
                {TARGET_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="ae-select__chevron" />
            </span>
          </label>
        </div>

        {(form.eventMode === "OFFLINE" || form.eventMode === "HYBRID") && (
          <label className="ae-field">
            <span className="ae-field__label">Venue</span>
            <input
              type="text"
              required
              value={form.venue}
              onChange={updateField("venue")}
            />
          </label>
        )}

        {(form.eventMode === "ONLINE" || form.eventMode === "HYBRID") && (
          <label className="ae-field">
            <span className="ae-field__label">Event Link</span>
            <input
              type="url"
              required
              value={form.eventLink}
              onChange={updateField("eventLink")}
            />
          </label>
        )}

        {formError && (
          <p className="ae-form-error" role="alert">
            {formError}
          </p>
        )}

        <div className="ae-modal__actions">
          <button
            type="button"
            className="ae-create-btn"
            onClick={handleCreate}
          >
            {event ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
