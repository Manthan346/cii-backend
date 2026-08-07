import React from 'react';
import StatCard from '../../shared/StatCard/StatCard';
import './UsersOverview.css';

/**
 * UsersOverview
 *
 * KPI row at the top of Total Users: Total User, Active User,
 * Inactive User, New User this month.
 *
 * Props:
 *  - stats: array of { id, label, value, icon, iconBg, trendValue,
 *           trendDirection, trendText } - see data/totalUsersData.js
 *           -> userStats for the shape.
 */
const UsersOverview = ({ stats = [] }) => {
  return (
    <div className="admin-users-overview">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconBg={stat.iconBg}
          trendValue={stat.trendValue}
          trendLabel={stat.trendLabel}
          trendDirection={stat.trendDirection}
          trendText={stat.trendText}
        />
      ))}
    </div>
  );
};

export default UsersOverview;
