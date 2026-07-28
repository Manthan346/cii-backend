import { Eye, Trash2, UserPlus } from "lucide-react";
import styles from "./ActionButtons.module.css";

/**
 * ActionButtons (Batch Management)
 *
 * Row-level actions for the "All Batches" table: view batch, delete
 * batch, assign a trainer. NOTE: page-local variant, kept out of
 * /shared because shared/ActionButtons (Candidate Management) exposes
 * a different four-icon set (view/edit/lock/delete).
 */
export default function ActionButtons({ onView, onDelete, onAssignTrainer }) {
  return (
    <div className={styles.actions}>
      <button type="button" className={styles.iconBtn} onClick={onView} aria-label="View batch">
        <Eye size={15} />
      </button>
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.danger}`}
        onClick={onDelete}
        aria-label="Delete batch"
      >
        <Trash2 size={15} />
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        onClick={onAssignTrainer}
        aria-label="Assign trainer"
      >
        <UserPlus size={15} />
      </button>
    </div>
  );
}
