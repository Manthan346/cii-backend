import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../shared";
import { batchOptions } from "../../../data/filterOptions";
import styles from "./CreateEventModal.module.css";

/**
 * CreateEventModal (Events)
 *
 * "+ Create Event" popup form: Title, Type, Mode, Date, Time, Venue /
 * meeting link, Batch, Max participants and a Description textarea.
 * Fires onSave(formValues) so the parent (Events) can prepend a new
 * row into the table and show the success toast.
 *
 * Kept page-local (not /shared) since the field set is specific to
 * creating an event. Also doubles as the Edit form when an
 * `initialValues` event record is passed in.
 */
const BATCH_CHOICES = ["All Batches", ...batchOptions.filter((option) => !option.toLowerCase().startsWith("all"))];

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
  const [mode, setMode] = useState(initialValues?.mode || modeOptions[0] || "Offline");
  const [date, setDate] = useState(initialValues?.rawDate || "");
  const [time, setTime] = useState(initialValues?.time || "");
  const [venue, setVenue] = useState(initialValues?.venue || "");
  const [batch, setBatch] = useState(initialValues?.batch || BATCH_CHOICES[0]);
  const [maxParticipants, setMaxParticipants] = useState(initialValues?.maxParticipants || "");
  const [description, setDescription] = useState(initialValues?.description || "");

  const isValid = title.trim().length > 0 && date.trim().length > 0;

  const handleSave = () => {
    if (!isValid) return;

    onSave?.({
      title: title.trim(),
      type,
      mode,
      date,
      time: time.trim(),
      venue: venue.trim(),
      batch,
      maxParticipants: maxParticipants || 0,
      description: description.trim(),
    });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={isEdit ? "Edit event" : "Create event"}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? "Edit Event" : "Create Event"}</h2>
          <button type="button" className={styles.closeBtn} onClick={onCancel} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Event title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="eg AI in Industry - Seminar"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Event type</label>
            <select className={styles.select} value={type} onChange={(event) => setType(event.target.value)}>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mode</label>
            <select className={styles.select} value={mode} onChange={(event) => setMode(event.target.value)}>
              {modeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Date <span className={styles.required}>*</span>
            </label>
            <input type="date" className={styles.input} value={date} onChange={(event) => setDate(event.target.value)} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Time</label>
            <input
              type="text"
              className={styles.input}
              placeholder="eg 10:00 AM - 12:00 PM"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Venue / meeting link</label>
          <input
            type="text"
            className={styles.input}
            placeholder="eg CII Auditorium, Mumbai or Zoom link"
            value={venue}
            onChange={(event) => setVenue(event.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Batch</label>
            <select className={styles.select} value={batch} onChange={(event) => setBatch(event.target.value)}>
              {BATCH_CHOICES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Max participants</label>
            <input
              type="number"
              min="0"
              className={styles.input}
              placeholder="eg 100"
              value={maxParticipants}
              onChange={(event) => setMaxParticipants(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            rows={3}
            placeholder="Short description shown to candidates when they view this event"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={styles.actions}>
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
