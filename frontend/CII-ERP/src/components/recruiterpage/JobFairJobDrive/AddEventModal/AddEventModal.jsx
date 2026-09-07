import React, { useEffect, useState } from "react";
import Modal from "../../shared/Modal/Modal";
import {
  createJobEvent,
  updateJobEvent,
  checkJobEventDateConflict,
} from "../../../../../api/recruiter/jobEventService";
import "./AddEventModal.css";

const EVENT_TYPES = ["Job Drive", "Job Fair"];

const INITIAL_FORM = {
  type: "",
  name: "",
  date: "",
  time: "",
  endTime: "",
  address: "", // combined venue + address — one field, one backend column
  mapsLink: "",
  description: "",
};

/**
 * AddEventModal
 *
 * Doubles as the Edit modal: pass `initialValues` (a mapped event
 * record from jobEventService, e.g. { type, name, date, time, venue,
 * address, mapsLink, description }) to prefill and switch to update
 * mode. Venue/Address were merged into one field since the backend
 * only ever stores a single combined `address` string — no way to
 * split it back apart on edit, so the UI doesn't pretend to.
 */
const AddEventModal = ({ isOpen, onClose, onSubmit, initialValues = null }) => {
  const isEditing = Boolean(initialValues);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dateWarning, setDateWarning] = useState("");

  useEffect(() => {
    if (isOpen && initialValues) {
      setForm({
        type: initialValues.type ?? "",
        name: initialValues.name ?? "",
        date: initialValues.dateISO ?? "", // see note below on dateISO
        time: initialValues.timeISO ?? "",
        endTime: initialValues.endTimeISO ?? "",
        address: initialValues.venue ?? initialValues.address ?? "",
        mapsLink: initialValues.mapLink ?? "",
        description: initialValues.description ?? "",
      });
    } else if (isOpen && !initialValues) {
      setForm(INITIAL_FORM);
    }
  }, [isOpen, initialValues]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "date") {
      setDateWarning("");
      if (value) {
        checkJobEventDateConflict(value)
          .then(({ eventCount }) => {
            if (eventCount >= 2) {
              setDateWarning(
                `${eventCount} events are already scheduled on this date. You can still proceed if needed.`,
              );
            }
          })
          .catch((err) => console.error("Failed to check date conflict:", err));
      }
    }
  };

  const handleTypeSelect = (type) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setError("");
    setDateWarning("");
    onClose();
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateJobEvent(initialValues.id, form);
      } else {
        await createJobEvent(form);
      }
      setForm(INITIAL_FORM);
      setDateWarning("");
      onSubmit();
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to save event.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth={760}>
      <h2 className="add-event-modal__title">
        {isEditing ? "Edit Event" : "Add Event"}
      </h2>

      {error && <p className="add-event-modal__error">{error}</p>}

      <div className="add-event-modal__field add-event-modal__field--select">
        <span className="add-event-modal__label add-event-modal__label--select">
          Select
        </span>
        <div className="add-event-modal__type-toggle">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`add-event-modal__type-option ${form.type === type ? "add-event-modal__type-option--active" : ""}`}
              onClick={() => handleTypeSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <label className="add-event-modal__field">
        <span className="add-event-modal__label">Name</span>
        <input
          type="text"
          placeholder="e.g. North Mumbai Job Fair/Job Drive"
          value={form.name}
          onChange={handleChange("name")}
          className="add-event-modal__input"
        />
      </label>

      <div className="add-event-modal__grid">
        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Date</span>
          <input
            type="date"
            value={form.date}
            onChange={handleChange("date")}
            className="add-event-modal__input"
          />
          {dateWarning && (
            <p className="add-event-modal__date-warning">{dateWarning}</p>
          )}
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Start Time</span>
          <input
            type="time"
            value={form.time}
            onChange={handleChange("time")}
            className="add-event-modal__input"
          />
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">End Time</span>
          <input
            type="time"
            value={form.endTime}
            onChange={handleChange("endTime")}
            className="add-event-modal__input"
          />
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Venue / Address</span>
          <input
            type="text"
            placeholder="e.g. Community Hall, 75 Nirlon Knowledge Park Rd, Mumbai"
            value={form.address}
            onChange={handleChange("address")}
            className="add-event-modal__input"
          />
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Google Maps Link</span>
          <input
            type="text"
            placeholder="https://maps.google.com/.."
            value={form.mapsLink}
            onChange={handleChange("mapsLink")}
            className="add-event-modal__input"
          />
        </label>

        <label
          className="add-event-modal__field"
          style={{ gridColumn: "1 / -1" }}
        >
          <span className="add-event-modal__label">Description</span>
          <input
            type="text"
            placeholder="Write about the event....."
            value={form.description}
            onChange={handleChange("description")}
            className="add-event-modal__input"
          />
        </label>
      </div>

      <div className="add-event-modal__footer">
        <button
          type="button"
          className="add-event-modal__btn"
          onClick={handleClose}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="add-event-modal__btn add-event-modal__btn--primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Event"}
        </button>
      </div>
    </Modal>
  );
};

export default AddEventModal;
