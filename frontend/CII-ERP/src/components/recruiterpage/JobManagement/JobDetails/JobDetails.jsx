import React from 'react';
import { LogIn, Star, Monitor, Briefcase } from 'lucide-react';
import StatCard from '../../shared/StatCard/StatCard';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import { jobStatusStyles } from '../../data';
import './JobDetails.css';

/**
 * JobDetails
 *
 * Read-only job preview, opened by clicking "View" in a row's action
 * menu (RowActionsMenu) - this is the "preview" the request refers
 * to. Reuses the shared StatCard (for the 4 top numbers) and shared
 * StatusBadge (for the Status field), same as the Dashboard and
 * JobTable.
 */
const JobDetails = ({ job, onBack, onEdit, onCloseJob }) => {
  const stats = job.stats ?? {};
  const eligibility = job.eligibility ?? {};

  return (
    <div className="job-details">
      <nav className="job-details__breadcrumb">
        <button type="button" className="job-details__breadcrumb-link" onClick={onBack}>
          Job Management
        </button>
        <span className="job-details__breadcrumb-sep">/</span>
        <span>Job Details</span>
      </nav>

      <div className="job-details__header">
        <div>
          <h1 className="job-details__title">{job.jobRole}</h1>
          <p className="job-details__meta">
            {job.department} · {job.location}
            {job.state ? `, ${job.state}` : ''} · Posted {job.postedDate}
          </p>
        </div>

        <div className="job-details__actions">
          <button type="button" className="job-details__btn" onClick={onEdit}>Edit</button>
          <button type="button" className="job-details__btn job-details__btn--danger" onClick={onCloseJob}>Close job</button>
        </div>
      </div>

      <div className="job-details__stats">
        <StatCard icon={LogIn} iconBg="#f97316" value={stats.totalApplications ?? 0} label="Total Applications" />
        <StatCard icon={Star} iconBg="#a855f7" value={stats.shortlisted ?? 0} label="Shortlisted" />
        <StatCard icon={Monitor} iconBg="#14b8a6" value={stats.interviewed ?? 0} label="Interviewed" />
        <StatCard icon={Briefcase} iconBg="#3b82f6" value={stats.hired ?? 0} label="Hired" />
      </div>

      <section className="job-details__card">
        <h2 className="job-details__card-title">Job Overview</h2>
        <div className="job-details__overview-grid">
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Department</span>
            <span className="job-details__overview-value">{job.department}</span>
          </div>
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Role</span>
            <span className="job-details__overview-value">{job.role}</span>
          </div>
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Employment Type</span>
            <span className="job-details__overview-value">{job.employmentType}</span>
          </div>
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Experience</span>
            <span className="job-details__overview-value">{job.experience}</span>
          </div>
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Vacancies</span>
            <span className="job-details__overview-value">{job.vacancy}</span>
          </div>
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Work Mode</span>
            <span className="job-details__overview-value">{job.mode}</span>
          </div>
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Location</span>
            <span className="job-details__overview-value">
              {job.location}{job.state ? `, ${job.state}` : ''}
            </span>
          </div>
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Status</span>
            <StatusBadge label={job.status} {...(jobStatusStyles[job.status] ?? {})} />
          </div>
          <div className="job-details__overview-item">
            <span className="job-details__overview-label">Deadline</span>
            <span className="job-details__overview-value">{job.deadline}</span>
          </div>
          {job.salary && (
            <div className="job-details__overview-item">
              <span className="job-details__overview-label">Salary</span>
              <span className="job-details__overview-value">{job.salary}</span>
            </div>
          )}
        </div>
      </section>

      {job.description && (
        <section className="job-details__card">
          <h2 className="job-details__card-title">Description</h2>
          <p className="job-details__description">{job.description}</p>
        </section>
      )}

      <div className="job-details__row">
        <section className="job-details__card">
          <h2 className="job-details__card-title">Required Skills</h2>
          <div className="job-details__tags">
            {(job.requiredSkills ?? []).map((skill) => (
              <span key={skill} className="job-details__tag job-details__tag--required">{skill}</span>
            ))}
            {(job.requiredSkills ?? []).length === 0 && (
              <span className="job-details__tags-empty">None listed</span>
            )}
          </div>

          <h2 className="job-details__card-title job-details__card-title--spaced">Preferred Skills</h2>
          <div className="job-details__tags">
            {(job.preferredSkills ?? []).map((skill) => (
              <span key={skill} className="job-details__tag job-details__tag--preferred">{skill}</span>
            ))}
            {(job.preferredSkills ?? []).length === 0 && (
              <span className="job-details__tags-empty">None listed</span>
            )}
          </div>
        </section>

        <section className="job-details__card">
          <h2 className="job-details__card-title">Responsibilities</h2>
          {(job.responsibilities ?? []).length > 0 ? (
            <ul className="job-details__list">
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <span className="job-details__tags-empty">None listed</span>
          )}
        </section>
      </div>

      {(eligibility.qualification || eligibility.passingYear || eligibility.minPercentage) && (
        <section className="job-details__card">
          <h2 className="job-details__card-title">Eligibility</h2>
          <div className="job-details__overview-grid">
            {eligibility.qualification && (
              <div className="job-details__overview-item">
                <span className="job-details__overview-label">Qualification</span>
                <span className="job-details__overview-value">{eligibility.qualification}</span>
              </div>
            )}
            {eligibility.passingYear && (
              <div className="job-details__overview-item">
                <span className="job-details__overview-label">Passing Year</span>
                <span className="job-details__overview-value">{eligibility.passingYear}</span>
              </div>
            )}
            {eligibility.minPercentage && (
              <div className="job-details__overview-item">
                <span className="job-details__overview-label">Minimum Percentage</span>
                <span className="job-details__overview-value">{eligibility.minPercentage}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default JobDetails;
