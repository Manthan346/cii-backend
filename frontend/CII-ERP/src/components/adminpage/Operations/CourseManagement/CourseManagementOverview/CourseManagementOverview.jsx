import React from 'react';
import StatCard from '../../../shared/StatCard/StatCard';
import './CourseManagementOverview.css';

/**
 * CourseManagementOverview
 *
 * KPI row at the top of Course Management: Total courses, Active
 * courses, Completed courses. Uses StatCard's 'inline' layout (icon
 * beside the label) rather than the 'split' layout used on
 * Dashboard/Total Users/Candidates.
 *
 * Props:
 *  - stats: array of { id, label, value, icon, iconBg, trendValue,
 *           trendDirection } - see data/courseManagementData.js ->
 *           courseStats for the shape.
 */
const CourseManagementOverview = ({ stats = [] }) => {
  return (
    <div className="admin-course-mgmt-overview">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          layout="inline"
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

export default CourseManagementOverview;
