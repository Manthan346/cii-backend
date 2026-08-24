import React from 'react';
import { Eye, Pencil, Ban } from 'lucide-react';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import RowActionsMenu from '../../shared/RowActionsMenu/RowActionsMenu';
import { jobStatusStyles } from '../../data';
import './JobTable.css';

/**
 * JobTable
 *
 * Renders the jobs list as a table matching the reference columns:
 * Job Role, Sector, Location, Type, Company Name, Mode, Vacancy,
 * No. of Application, Status, Posted Date, plus a row action menu.
 *
 * Per the request, the row menu only has three items: View (opens
 * JobDetails - this is the "preview"), Edit, and Close job. No
 * Duplicate / Archive / Delete here.
 */
const JobTable = ({ jobs, onViewJob, onEditJob, onCloseJob }) => {
  return (
    <div className="job-table">
      <table className="job-table__table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Sector</th>
            <th>Location</th>
            <th>Type</th>
            <th>Company Name</th>
            <th>Mode</th>
            <th>Vacancy</th>
            <th>No. of Application</th>
            <th>Status</th>
            <th>Posted Date</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="job-table__role">{job.jobRole}</td>
              <td>{job.sector}</td>
              <td>{job.location}</td>
              <td>{job.type}</td>
              <td>{job.companyName}</td>
              <td>{job.mode}</td>
              <td>{job.vacancy}</td>
              <td>{job.applications}</td>
              <td>
                <StatusBadge label={job.status} {...(jobStatusStyles[job.status] ?? {})} />
              </td>
              <td>{job.postedDate}</td>
              <td className="job-table__actions">
                <RowActionsMenu
                  items={[
                    { id: 'view', label: 'View', icon: Eye, onClick: () => onViewJob(job.id) },
                    { id: 'edit', label: 'Edit', icon: Pencil, onClick: () => onEditJob(job.id) },
                    { id: 'close', label: 'Close job', icon: Ban, danger: true, onClick: () => onCloseJob(job.id) },
                  ]}
                />
              </td>
            </tr>
          ))}

          {jobs.length === 0 && (
            <tr>
              <td colSpan={11} className="job-table__empty">
                No jobs match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
