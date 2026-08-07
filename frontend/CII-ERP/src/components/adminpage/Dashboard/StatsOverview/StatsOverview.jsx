import React from 'react';
import StatCard from '../../shared/StatCard/StatCard';
import './StatsOverview.css';

/**
 * StatsOverview
 *
 * KPI row at the top of the Dashboard: Total User, Total Candidates,
 * Total staff, Monthly Enrollments (or whatever `stats` is passed in
 * for other pages that reuse this block).
 *
 * Props:
 *  - stats: array of { id, label, value, icon, iconBg, trendValue, trendDirection }
 *           see Dashboard/data.js -> summaryStats for the shape.
 */
const StatsOverview = ({ stats = [] }) => {
  return (
    <div className="admin-stats-overview">
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

export default StatsOverview;
