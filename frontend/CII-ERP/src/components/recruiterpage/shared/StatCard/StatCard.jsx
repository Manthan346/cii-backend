import React from 'react';
import './StatCard.css';

/**
 * StatCard
 *
 * One tile in the dashboard's top stat grid: a colored icon badge on
 * the left, a bold number + label stacked on the right. Purely
 * presentational - all 8 cards on the Recruiter Dashboard render from
 * the same component via data/dashboardData.js's `statCards` array.
 *
 * Props:
 *  - icon: a lucide-react icon component (not an element - StatCard renders it itself)
 *  - iconBg: background color for the icon badge
 *  - value: the big number
 *  - label: the (often two-line) caption under the number
 */
const StatCard = ({ icon: Icon, iconBg, value, label }) => {
  return (
    <div className="stat-card">
      <span className="stat-card__icon" style={{ backgroundColor: iconBg }}>
        <Icon size={20} strokeWidth={2} color="#ffffff" />
      </span>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
};

export default StatCard;
