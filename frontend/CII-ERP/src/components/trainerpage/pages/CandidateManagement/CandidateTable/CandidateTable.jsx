import { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import { ActionButtons } from '../../../shared';
import ViewCandidateModal from '../ViewCandidateModal/ViewCandidateModal';
import EditStatusModal from '../EditStatusModal/EditStatusModal';
import './CandidateTable.css';

/**
 * CandidateTable
 *
 * "All Candidates" table for the Candidate Management page. Column shape
 * is specific to candidates, so this lives inside pages/CandidateManagement
 * rather than /shared - only the generic row-action icon buttons come
 * from /shared (ActionButtons), since those are reusable on any table.
 *
 * Contact and Attendance columns were removed from the table itself -
 * that info (plus everything else) now lives in the short popup opened
 * by the Eye icon. The Edit (pencil) icon opens a small popup used only
 * to set a candidate's status to Active or Dropped.
 */
export default function CandidateTable({ candidates = [], onStatusChange }) {
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const handleSaveStatus = (newStatus) => {
    if (editingCandidate) {
      onStatusChange?.(editingCandidate.id, newStatus);
    }
    setEditingCandidate(null);
  };
  return (
    <div className={'tableWrap'}>
      <table className={'table'}>
        <thead>
          <tr>
            <th className={'checkboxCol'}>
              <input type="checkbox" aria-label="Select all candidates" />
            </th>
            <th>Candidates ID</th>
            <th>Name</th>
            <th>Batch</th>
            <th>Course</th>
            <th>Join Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>
                <input
                  type="checkbox"
                  defaultChecked
                  aria-label={`Select ${candidate.name}`}
                />
              </td>
              <td className={'idCell'}>{candidate.candidateId}</td>
              <td>
                <div className={'nameCell'}>
                  <UserCircle2 size={22} className={'avatarIcon'} />
                  <span>{candidate.name}</span>
                </div>
              </td>
              <td>{candidate.batch}</td>
              <td>{candidate.course}</td>
              <td className={'nowrap'}>{candidate.joinDate}</td>
              <td>
                <StatusBadge status={candidate.status} />
              </td>
              <td>
                <ActionButtons
                  onView={() => setViewingCandidate(candidate)}
                  onEdit={() => setEditingCandidate(candidate)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewingCandidate && (
        <ViewCandidateModal
          candidate={viewingCandidate}
          onClose={() => setViewingCandidate(null)}
        />
      )}

      {editingCandidate && (
        <EditStatusModal
          candidate={editingCandidate}
          onCancel={() => setEditingCandidate(null)}
          onSave={handleSaveStatus}
        />
      )}
    </div>
  );
}
