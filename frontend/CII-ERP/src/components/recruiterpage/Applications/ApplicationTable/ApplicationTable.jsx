import React from 'react';
import { Eye } from 'lucide-react';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import RowActionsMenu from '../../shared/RowActionsMenu/RowActionsMenu';
import { applicationsPageStatusStyles } from '../../data';
import './ApplicationTable.css';

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * ApplicationTable
 *
 * The Applications list table: Candidate, Job Role, Company, Contact
 * No., Applied Date, Resume (Preview button - opens resumeUrl in a
 * new tab), Source, Status, plus a row action menu.
 *
 * Per request, the row menu only has one item: View Profile - opens
 * CandidateProfile for that candidate (a full page, not a modal).
 */
const ApplicationTable = ({ applications, onViewProfile }) => {
  const handlePreview = (candidate) => {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="application-table">
      <table className="application-table__table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job Role</th>
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
                <div className="application-table__candidate">
                  <span
                    className="application-table__avatar"
                    style={{ backgroundColor: candidate.avatarColor }}
                  >
                    {getInitials(candidate.name)}
                  </span>
                  {candidate.name}
                </div>
              </td>
              <td className="application-table__role">{candidate.jobRole}</td>
              <td>
                <span className="application-table__company">{candidate.company}</span>
              </td>
              <td>{candidate.contactNo}</td>
              <td>{candidate.appliedDate}</td>
              <td>
                <button
                  type="button"
                  className="application-table__preview-btn"
                  onClick={() => handlePreview(candidate)}
                  disabled={!candidate.resumeUrl}
                  title={candidate.resumeUrl ? 'Open resume in a new tab' : 'No resume on file'}
                >
                  Preview
                </button>
              </td>
              <td>{candidate.source}</td>
              <td>
                <StatusBadge label={candidate.status} {...(applicationsPageStatusStyles[candidate.status] ?? {})} />
              </td>
              <td className="application-table__actions">
                <RowActionsMenu
                  items={[
                    { id: 'view-profile', label: 'View Profile', icon: Eye, onClick: () => onViewProfile(candidate.id) },
                  ]}
                />
              </td>
            </tr>
          ))}

          {applications.length === 0 && (
            <tr>
              <td colSpan={9} className="application-table__empty">
                No applications match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
