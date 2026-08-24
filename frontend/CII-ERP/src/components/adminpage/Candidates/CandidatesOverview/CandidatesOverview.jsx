import React from 'react';
import StatCard from '../../shared/StatCard/StatCard';
import './CandidatesOverview.css';

/**
 * CandidatesOverview
 *
 * KPI row at the top of Candidates: Total Candidates, Active
 * Candidates, Course Completed, Inactive candidates.
 *
 * Props:
 *  - stats: array of { id, label, value, icon, iconBg, trendValue,
 *           trendDirection } - see data/candidatesData.js ->
 *           candidateStats for the shape.
 */
const CandidatesOverview = ({ stats = [] }) => {
  return (
    <div className="admin-candidates-overview">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconBg={stat.iconBg}
          trendValue={stat.trendValue}
          trendDirection={stat.trendDirection}
        />
      ))}
    </div>
  );
};

export default CandidatesOverview;
