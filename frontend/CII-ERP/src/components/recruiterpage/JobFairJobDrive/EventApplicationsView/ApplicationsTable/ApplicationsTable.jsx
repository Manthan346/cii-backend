import React from 'react';
import { Eye, X } from 'lucide-react';
import StatusBadge from '../../../shared/StatusBadge/StatusBadge';
import RowActionsMenu from '../../../shared/RowActionsMenu/RowActionsMenu';
import { applicationStatusStyles } from '../../../data';
import './ApplicationsTable.css';

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * ApplicationsTable
 *
 * Candidate applications table for one event: Candidate, Applied To,
 * Company, Contact No., Applied Date, Resume (Preview button),
 * Source, Status, plus a row action menu.
 *
 * The reference design's Resume "Preview" button and the row menu's
 * "View Profile" both open the same CandidateDetailsModal - there's
 * no real resume file to preview, so both just open the candidate's
 * details popup (see onPreview prop).
 *
 * The row menu only has two items: View Profile and Remove.
 */
const ApplicationsTable = ({ applications, onPreview, onRemove }) => {
  return (
    <div className="applications-table">
      <table className="applications-table__table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Applied To</th>
            <th>Company</th>
            <th>Contact No.</th>
            <th>Applied Date</th>
            <th>Resume</th>
            <th>Source</th>
            <th>Status</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {applications.map((candidate) => (
            <tr key={candidate.id}>
              <td>
                <div className="applications-table__candidate">
                  <span
                    className="applications-table__avatar"
                    style={{ backgroundColor: candidate.avatarColor }}
                  >
                    {getInitials(candidate.name)}
                  </span>
                  {candidate.name}
                </div>
              </td>
              <td className="applications-table__applied-to">{candidate.appliedTo}</td>
              <td>
                <span className="applications-table__company">{candidate.company}</span>
              </td>
              <td>{candidate.contactNo}</td>
              <td>{candidate.appliedDate}</td>
              <td>
                <button
                  type="button"
                  className="applications-table__preview-btn"
                  onClick={() => onPreview(candidate.id)}
                >
                  <Eye size={14} />
                  Preview
                </button>
              </td>
              <td>{candidate.source}</td>
              <td>
                <StatusBadge label={candidate.status} {...(applicationStatusStyles[candidate.status] ?? {})} />
              </td>
              <td className="applications-table__actions">
                <RowActionsMenu
                  items={[
                    { id: 'view-profile', label: 'View Profile', icon: Eye, onClick: () => onPreview(candidate.id) },
                    { id: 'remove', label: 'Remove', icon: X, danger: true, onClick: () => onRemove(candidate.id) },
                  ]}
                />
              </td>
            </tr>
          ))}

          {applications.length === 0 && (
            <tr>
              <td colSpan={9} className="applications-table__empty">
                No applications match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;
