import { useState } from "react";
import { Button } from "../../../shared";
import { batchOptions, courseOptions } from "../../../data/filterOptions";
import styles from "./AddCandidateModal.module.css";

/**
 * AddCandidateModal
 *
 * "+ Add Candidate" popup form: Name, Candidate ID, Batch, Course,
 * Contact, Join date, and a Active/Dropped/Ending Soon status radio
 * group. Fires onSave(formValues) so the parent (CandidateManagement)
 * can prepend a new row into the table and show the success toast.
 *
 * Kept page-local (not /shared) since the field set is specific to
 * adding a candidate. Styling/markup intentionally mirrors
 * MarkAttendanceModal so every popup in the app looks the same.
 */
const STATUS_OPTIONS = ["Active", "Dropped", "Ending Soon"];

// Dropdown options reuse the filter bar's arrays, minus the "All ..."
// placeholder entries which don't make sense when picking a value.
const BATCH_CHOICES = batchOptions.filter((option) => !option.toLowerCase().startsWith("all"));
const COURSE_CHOICES = courseOptions.filter((option) => !option.toLowerCase().startsWith("all"));

export default function AddCandidateModal({ onCancel, onSave }) {
  const [name, setName] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [batch, setBatch] = useState(BATCH_CHOICES[0] || "");
  const [course, setCourse] = useState(COURSE_CHOICES[0] || "");
  const [contact, setContact] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [status, setStatus] = useState("Active");

  const isValid = name.trim().length > 0;

  const handleSave = () => {
    if (!isValid) return;

    onSave?.({
      name: name.trim(),
      candidateId: candidateId.trim(),
      batch,
      course,
      contact: contact.trim(),
      joinDate: joinDate.trim(),
      status,
    });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Add candidate">
      <div className={styles.modal}>
        <h2 className={styles.title}>Add Candidate</h2>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="eg Ankita Sharma"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Candidate ID</label>
            <input
              type="text"
              className={styles.input}
              placeholder="eg CII-DS-1042"
              value={candidateId}
              onChange={(event) => setCandidateId(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Batch</label>
            <select
              className={styles.select}
              value={batch}
              onChange={(event) => setBatch(event.target.value)}
            >
              {BATCH_CHOICES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Course</label>
            <select
              className={styles.select}
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            >
              {COURSE_CHOICES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Contact</label>
            <input
              type="text"
              className={styles.input}
              placeholder="8734596739"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Join Date</label>
            <input
              type="text"
              className={styles.input}
              placeholder="dd-mm-yy"
              value={joinDate}
              onChange={(event) => setJoinDate(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <div className={styles.radioGroup}>
            {STATUS_OPTIONS.map((option) => (
              <label key={option} className={styles.radioOption}>
                <input
                  type="radio"
                  name="candidate-status"
                  value={option}
                  checked={status === option}
                  onChange={() => setStatus(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!isValid}>
            Save Candidate
          </Button>
        </div>
      </div>
    </div>
  );
}
