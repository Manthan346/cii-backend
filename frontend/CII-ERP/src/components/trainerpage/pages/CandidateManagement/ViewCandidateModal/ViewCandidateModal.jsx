import { X, UserCircle2 } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import './ViewCandidateModal.css';

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
    <div
      className={'candidate-management-view-candidate-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Candidate details"
    >
      <div className={'candidate-management-view-candidate-modal-modal'}>
        <button
          type="button"
          className={'candidate-management-view-candidate-modal-close-btn'}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={'candidate-management-view-candidate-modal-header'}>
          <UserCircle2
            size={40}
            className={'candidate-management-view-candidate-modal-avatar'}
          />
          <div>
            <h2 className={'candidate-management-view-candidate-modal-name'}>
              {candidate.name}
            </h2>
            <p className={'candidate-management-view-candidate-modal-id'}>
              {candidate.candidateId}
            </p>
          </div>
          <StatusBadge status={candidate.status} />
        </div>

        <div className={'candidate-management-view-candidate-modal-grid'}>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>
              Batch
            </span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {candidate.batch}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>
              Course
            </span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {candidate.course}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>
              Contact Number
            </span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {candidate.contact}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>
              Join Date
            </span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {candidate.joinDate}
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>
              Attendance
            </span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {candidate.attendance}%
            </span>
          </div>
          <div className={'candidate-management-view-candidate-modal-field'}>
            <span className={'candidate-management-view-candidate-modal-label'}>
              Progress
            </span>
            <span className={'candidate-management-view-candidate-modal-value'}>
              {candidate.progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
