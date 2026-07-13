// ============================================================================
// JobStats.jsx
// ----------------------------------------------------------------------------
// The row of solid-blue stat cards at the top of the Job Opportunities page
// (mirrors the same visual style used on the Certificates page).
//
// BACKEND NOTE: `stats` is passed down from JobOpportunities.jsx after
// fetching GET /api/candidates/:id/job-opportunities/stats
// ============================================================================

import React from "react";
import Icon from "../../../shared/Icon/Icon";

import { jobOpportunityStats } from "../../../../../data/jobOpportunitiesData";
import "./JobStats.css";

const JobStats = ({ stats = jobOpportunityStats }) => {
  return (
    <div className="job-stats">
      {stats.map((stat) => (
        <div className="job-stat-card" key={stat.id}>
          <Icon
            name={stat.icon}
            size={22}
            color="currentColor"
            className="job-stat-card__icon"
          />
          <p className="job-stat-card__value">{stat.value}</p>
          <p className="job-stat-card__label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default JobStats;
