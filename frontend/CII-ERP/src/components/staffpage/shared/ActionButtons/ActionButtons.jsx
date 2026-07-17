import { Eye, Pencil, Lock, Trash2 } from 'lucide-react';
import styles from './ActionButtons.module.css';

export default function ActionButtons({ onView, onEdit, onLock, onDelete, showLock = true }) {
  return (
    <div className={styles.actions}>
      <button type="button" className={styles.iconBtn} onClick={onView} aria-label="View candidate">
        <Eye size={15} />
      </button>
      <button type="button" className={styles.iconBtn} onClick={onEdit} aria-label="Edit candidate">
        <Pencil size={15} />
      </button>
      {showLock && (
        <button type="button" className={styles.iconBtn} onClick={onLock} aria-label="Lock candidate">
          <Lock size={15} />
        </button>
      )}
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.danger}`}
        onClick={onDelete}
        aria-label="Delete candidate"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
