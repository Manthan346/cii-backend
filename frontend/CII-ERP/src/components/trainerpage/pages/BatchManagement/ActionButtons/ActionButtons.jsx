import { Eye, UserPlus } from 'lucide-react';
import './ActionButtons.css';

/**
 * ActionButtons (Batch Management)
 *
 * Row-level actions for the "All Batches" table: view batch, assign a
 * trainer. Delete was removed per request. NOTE: page-local variant,
 * kept out of /shared because shared/ActionButtons (Candidate
 * Management) exposes a different four-icon set (view/edit/lock/delete).
 */
export default function ActionButtons({ onView, onAssignTrainer }) {
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
      {/* <button
        type="button"
        className={'batch-management-batch-list-action-buttons-icon-btn'}
        onClick={onAssignTrainer}
        aria-label="Assign trainer"
      >
        <UserPlus size={15} />
      </button> */}
    </div>
  );
}
