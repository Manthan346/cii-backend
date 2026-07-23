import { X, UserCircle2 } from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import styles from "./ViewCandidateModal.module.css";

/**
 * ViewCandidateModal
 *
 * Short popup opened by the Eye icon in the candidate table's Action
 * column. Shows all of a candidate's details in one place - including
 * their contact number, since the Contact column was removed from the
 * main table.
 */
export default function ViewCandidateModal({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Candidate details">
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        <div className={styles.header}>
          <UserCircle2 size={40} className={styles.avatar} />
          <div>
            <h2 className={styles.name}>{candidate.name}</h2>
            <p className={styles.id}>{candidate.candidateId}</p>
          </div>
          <StatusBadge status={candidate.status} />
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Batch</span>
            <span className={styles.value}>{candidate.batch}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Course</span>
            <span className={styles.value}>{candidate.course}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Contact Number</span>
            <span className={styles.value}>{candidate.contact}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Join Date</span>
            <span className={styles.value}>{candidate.joinDate}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Attendance</span>
            <span className={styles.value}>{candidate.attendance}%</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Progress</span>
            <span className={styles.value}>{candidate.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
