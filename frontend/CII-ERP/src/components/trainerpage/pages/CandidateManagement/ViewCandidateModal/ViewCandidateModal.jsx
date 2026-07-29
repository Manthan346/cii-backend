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
      className={'overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Candidate details"
    >
      <div className={'modal'}>
        <button
          type="button"
          className={'closeBtn'}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={'header'}>
          <UserCircle2 size={40} className={'avatar'} />
          <div>
            <h2 className={'name'}>{candidate.name}</h2>
            <p className={'id'}>{candidate.candidateId}</p>
          </div>
          <StatusBadge status={candidate.status} />
        </div>

        <div className={'grid'}>
          <div className={'field'}>
            <span className={'label'}>Batch</span>
            <span className={'value'}>{candidate.batch}</span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Course</span>
            <span className={'value'}>{candidate.course}</span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Contact Number</span>
            <span className={'value'}>{candidate.contact}</span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Join Date</span>
            <span className={'value'}>{candidate.joinDate}</span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Attendance</span>
            <span className={'value'}>{candidate.attendance}%</span>
          </div>
          <div className={'field'}>
            <span className={'label'}>Progress</span>
            <span className={'value'}>{candidate.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
