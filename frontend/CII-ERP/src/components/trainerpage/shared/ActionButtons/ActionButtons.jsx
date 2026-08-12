import { Eye, Pencil, Lock, Trash2 } from 'lucide-react';
import './ActionButtons.css';
export default function ActionButtons({
  onView,
  onEdit,
  onLock,
  onDelete,
  showLock = true,
  showEdit = true,
}) {
  return (
    <div className={'shared-action-buttons-actions'}>
      <button
        type="button"
        className={'shared-action-buttons-icon-btn'}
        onClick={onView}
        aria-label="View candidate"
      >
        <Eye size={15} />
      </button>
      {showEdit && (
        <button
          type="button"
          className={'shared-action-buttons-icon-btn'}
          onClick={onEdit}
          aria-label="Edit candidate"
        >
          <Pencil size={15} />
        </button>
      )}
      {showLock && (
        <button
          type="button"
          className={'shared-action-buttons-icon-btn'}
          onClick={onLock}
          aria-label="Lock candidate"
        >
          <Lock size={15} />
        </button>
      )}
    </div>
  );
}
