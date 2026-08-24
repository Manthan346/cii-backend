import React from 'react';
import StatCard from '../../shared/StatCard/StatCard';
import './SuspendedOverview.css';

/**
 * SuspendedOverview
 *
 * KPI row at the top of Suspended Accounts: Suspended accounts (this
 * month) and Total Suspended accounts.
 *
 * Props:
 *  - stats: array of { id, label, value, icon, iconBg, trendValue,
 *           trendDirection } - see data/suspendedAccountsData.js ->
 *           suspendedStats for the shape.
 */
const SuspendedOverview = ({ stats = [] }) => {
  return (
    <div className="admin-suspended-overview">
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

export default SuspendedOverview;
