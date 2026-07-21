import { useState } from "react";
import { Button } from "../../../shared";
import styles from "./MarkAttendanceModal.module.css";

/**
 * MarkAttendanceModal
 *
 * "+ Mark attendance" popup form: Batch name, Date, candidate, a
 * Present/Late/Absent radio group, and a Remark note. Fires
 * onSave(formValues) so the parent (AttendanceTracker) can push a new
 * row into the table and show the success toast.
 *
 * Kept page-local (not /shared) since the field set is specific to
 * marking attendance.
 */
const STATUS_OPTIONS = ["Present", "Late", "Absent"];

export default function MarkAttendanceModal({ defaultDate = "", onCancel, onSave }) {
  const [batchName, setBatchName] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [candidate, setCandidate] = useState("");
  const [status, setStatus] = useState("Present");
  const [remark, setRemark] = useState("");

  const handleSave = () => {
    onSave?.({ batchName, date, candidate, status, remark });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Mark attendance">
      <div className={styles.modal}>
        <h2 className={styles.title}>Mark Attendance</h2>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Batch name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="eg DS-24"
              value={batchName}
              onChange={(event) => setBatchName(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input
              type="text"
              className={styles.input}
              placeholder="dd-mm-yy"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>candidate</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Ankita sharma CII-DS-24"
            value={candidate}
            onChange={(event) => setCandidate(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <div className={styles.radioGroup}>
            {STATUS_OPTIONS.map((option) => (
              <label key={option} className={styles.radioOption}>
                <input
                  type="radio"
                  name="attendance-status"
                  value={option}
                  checked={status === option}
                  onChange={() => setStatus(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Remark</label>
          <textarea
            className={styles.textarea}
            placeholder="Add note"
            rows={3}
            value={remark}
            onChange={(event) => setRemark(event.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Attendance
          </Button>
        </div>
      </div>
    </div>
  );
}
