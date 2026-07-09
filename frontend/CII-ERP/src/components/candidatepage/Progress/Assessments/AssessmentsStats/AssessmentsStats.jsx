// ============================================================================
// AssessmentsStats.jsx
// ----------------------------------------------------------------------------
// Renders the 4 summary cards at the top of the Assessments page:
// Pending / Completed / Average score / Best score.
//
// Reuses the shared <StatCard /> component so the styling stays consistent
// with the rest of the candidate portal (Dashboard, Attendance, etc.).
//
// If your actual StatCard implementation exposes different prop names,
// just adjust the props being passed below — the data shape itself
// (see ../assessmentsData.js -> assessmentStats) will not need to change.
// ============================================================================

import React from "react";
import StatCard from "../../../shared/StatCard/StatCard";
import { assessmentStats } from "../../../../../data/assessmentsData";
import "./AssessmentsStats.css";

// props.stats allows the parent (Assessments.jsx) to pass live/fetched data.
// Falls back to local mock data so the component still renders in isolation.
const AssessmentsStats = ({ stats = assessmentStats }) => {
  return (
    <div className="assessments-stats">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
};

export default AssessmentsStats;
