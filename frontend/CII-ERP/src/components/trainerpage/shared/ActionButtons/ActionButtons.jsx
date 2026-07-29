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
    <div className={'actions'}>
      <button
        type="button"
        className={'iconBtn'}
        onClick={onView}
        aria-label="View candidate"
      >
        <Eye size={15} />
      </button>
      {showEdit && (
        <button
          type="button"
          className={'iconBtn'}
          onClick={onEdit}
          aria-label="Edit candidate"
        >
          <Pencil size={15} />
        </button>
      )}
      {showLock && (
        <button
          type="button"
          className={'iconBtn'}
          onClick={onLock}
          aria-label="Lock candidate"
        >
          <Lock size={15} />
        </button>
      )}
      <button
        type="button"
        className={'iconBtn danger'}
        onClick={onDelete}
        aria-label="Delete candidate"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
