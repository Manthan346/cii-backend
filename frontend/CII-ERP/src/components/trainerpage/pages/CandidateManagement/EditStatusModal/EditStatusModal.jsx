import { useState } from "react";
import { Button } from "../../../shared";
import styles from "./EditStatusModal.module.css";

/**
 * EditStatusModal
 *
 * Small popup opened by the Edit (pencil) icon in the candidate table's
 * Action column. Its only job is letting the trainer set a candidate's
 * status to Active or Dropped - fires onSave(newStatus).
 */
const STATUS_OPTIONS = ["Active", "Dropped"];

export default function EditStatusModal({ candidate, onCancel, onSave }) {
  const [status, setStatus] = useState(candidate?.status === "Dropped" ? "Dropped" : "Active");

  if (!candidate) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Edit candidate status">
      <div className={styles.modal}>
        <h2 className={styles.title}>Edit Status</h2>
        <p className={styles.subtitle}>{candidate.name}</p>

        <div className={styles.radioGroup}>
          {STATUS_OPTIONS.map((option) => (
            <label key={option} className={styles.radioOption}>
              <input
                type="radio"
                name="candidate-edit-status"
                value={option}
                checked={status === option}
                onChange={() => setStatus(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave?.(status)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
