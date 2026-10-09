import { Eye, Pencil } from 'lucide-react';
import './ActionButtons.css';

/**
 * ActionButtons (Batch Management)
 *
 * Row-level actions for the "All Batches" table: view and edit batch.
 * This page-specific set stays separate from Candidate Management's
 * shared row actions.
 */
export default function ActionButtons({ onView, onEdit }) {
  return (
    <div className={'batch-management-batch-list-action-buttons-actions'}>
      <button
        type="button"
        className={'batch-management-batch-list-action-buttons-icon-btn'}
        onClick={onView}
        aria-label="View batch"
      >
        <Eye size={15} />
      </button>
      <button
        type="button"
        className={'batch-management-batch-list-action-buttons-icon-btn'}
        onClick={onEdit}
        aria-label="Edit batch"
      >
        <Pencil size={15} />
      </button>
    </div>
  );
}
