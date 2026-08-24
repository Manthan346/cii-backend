import React from 'react';
import StatCard from '../../../shared/StatCard/StatCard';
import './ApprovalRequestsOverview.css';

/**
 * ApprovalRequestsOverview
 *
 * KPI row at the top of Approval Requests: Pending, Approved,
 * Rejected. Uses StatCard's 'stacked' layout (icon alone on top, then
 * value, then label, then trend/caption) - the third StatCard layout
 * variant, distinct from Dashboard's 'split' and Course Management's
 * 'inline'.
 *
 * Props:
 *  - stats: array of { id, label, value, icon, iconBg, trendValue,
 *           trendDirection, trendText } - see
 *           data/approvalRequestsPageData.js -> approvalStats for the shape.
 */
const ApprovalRequestsOverview = ({ stats = [] }) => {
  return (
    <div className="admin-approval-overview">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          layout="stacked"
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

export default ApprovalRequestsOverview;
