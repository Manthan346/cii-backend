import React, { useState } from "react";
import Modal from "../../shared/Modal/Modal";
import { createJobEvent } from "../../../../../api/recruiter/jobEventService";
import "./AddEventModal.css";

const EVENT_TYPES = ["Job Drive", "Job Fair"];

const INITIAL_FORM = {
  type: "",
  name: "",
  date: "",
  time: "",
  venue: "",
  address: "",
  mapsLink: "",
  description: "",
};

/**
 * AddEventModal
 *
 * Opened by the "+ Add Events" button. Posts directly to
 * POST /job-event/add via createJobEvent(). On success calls
 * onSubmit() with no arguments — JobFairJobDrive.jsx just uses that
 * as a signal to close the modal and refetch the list, it doesn't
 * need the created event back.
 */
const AddEventModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleTypeSelect = (type) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await createJobEvent(form);
      setForm(INITIAL_FORM);
      onSubmit();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create event.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth={760}>
      <h2 className="add-event-modal__title">Add Event</h2>

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
          <span className="add-event-modal__label">Venue</span>
          <input
            type="text"
            placeholder="e.g. Community hall"
            value={form.venue}
            onChange={handleChange("venue")}
            className="add-event-modal__input"
          />
        </label>

        <label className="add-event-modal__field">
          <span className="add-event-modal__label">Address</span>
          <input
            type="text"
            placeholder="Enter full address....."
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

        <label className="add-event-modal__field">
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
          {submitting ? "Adding..." : "Add Event"}
        </button>
      </div>
    </Modal>
  );
};

export default AddEventModal;
