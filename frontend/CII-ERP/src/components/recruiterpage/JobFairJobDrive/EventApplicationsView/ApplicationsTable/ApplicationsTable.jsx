import React from 'react';
import './ApplicationsTable.css';

/**
 * ApplicationsTable
 *
 * Candidate applications table for one event with the recruitment fields
 * requested for the recruiter screen: Location, Qualification, College,
 * Experience and Vidhansabha.
 */
const ApplicationsTable = ({ applications }) => {
  return (
    <div className="applications-table">
      <table className="applications-table__table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Contact No.</th>
            <th>Location</th>
            <th>Qualification</th>
            <th>College</th>
            <th>Experience</th>
            <th>Vidhansabha</th>
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
                    {candidate.name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase() || 'NA'}
                  </span>
                  {candidate.name}
                </div>
              </td>
              <td>{candidate.contactNo ?? '—'}</td>
              <td>{candidate.location ?? '—'}</td>
              <td>{candidate.qualification ?? '—'}</td>
              <td>{candidate.college ?? '—'}</td>
              <td>{candidate.experience ?? '—'}</td>
              <td>{candidate.vidhansabha ?? '—'}</td>
            </tr>
          ))}

          {applications.length === 0 && (
            <tr>
              <td colSpan={7} className="applications-table__empty">
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
