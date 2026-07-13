// ============================================================================
// JobList.jsx
// ----------------------------------------------------------------------------
// Renders the row of <JobCard /> items. Matches the reference screenshot's
// horizontally-scrolling strip (the next card is partially visible at the
// right edge before scrolling).
//
// BACKEND NOTE: `jobs` is passed down from JobOpportunities.jsx after
// fetching GET /api/candidates/:id/job-opportunities?...filters
// ============================================================================

import React from "react";
import JobCard from "../JobCard/JobCard";
import { jobOpportunities } from "../../../../../data/jobOpportunitiesData";
import "./JobList.css";

const JobList = ({ jobs = jobOpportunities, onApply, onToggleSave }) => {
  if (jobs.length === 0) {
    return (
      <p className="job-list__empty">
        No matching opportunities right now — check back soon.
      </p>
    );
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onApply={onApply} onToggleSave={onToggleSave} />
      ))}
    </div>
  );
};

export default JobList;
