import { useState } from 'react';
import { Button } from '../../../shared';
import './EditStatusModal.css';

/**
 * EditStatusModal
 *
 * Small popup opened by the Edit (pencil) icon in the candidate table's
 * Action column. Its only job is letting the trainer set a candidate's
 * status to Active or Dropped - fires onSave(newStatus).
 */
const STATUS_OPTIONS = ['Active', 'Dropped'];
export default function EditStatusModal({ candidate, onCancel, onSave }) {
  const [status, setStatus] = useState(
    candidate?.status === 'Dropped' ? 'Dropped' : 'Active',
  );
  if (!candidate) return null;
  return (
    <div
      className={'candidate-management-edit-status-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Edit candidate status"
    >
      <div className={'candidate-management-edit-status-modal-modal'}>
        <h2 className={'candidate-management-edit-status-modal-title'}>
          Edit Status
        </h2>
        <p className={'candidate-management-edit-status-modal-subtitle'}>
          {candidate.name}
        </p>

        <div className={'candidate-management-edit-status-modal-radio-group'}>
          {STATUS_OPTIONS.map((option) => (
            <label
              key={option}
              className={'candidate-management-edit-status-modal-radio-option'}
            >
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

        <div className={'candidate-management-edit-status-modal-actions'}>
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
