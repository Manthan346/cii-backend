import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

/**
 * StatCard
 *
 * Small metric tile used across admin dashboards (Total Users, Total
 * Candidates, Total staff, Monthly Enrollments, and similar KPIs on
 * other pages). Lives in /shared because more than one dashboard will
 * reuse it.
 *
 * Props:
 *  - label: string             -> metric name, e.g. "Total Candidates"
 *  - value: string | number    -> the headline number, e.g. "3,950"
 *  - icon: LucideIcon          -> icon shown in the colored badge
 *  - iconBg: string            -> CSS color/gradient for the badge background
 *  - trendValue: string        -> e.g. "4.2%"
 *  - trendLabel: string        -> e.g. "this month"
 *  - trendDirection: 'up' | 'down'
 */
const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg = '#8C7CF0',
  trendValue,
  trendLabel = 'this month',
  trendDirection = 'up',
}) => {
  const TrendIcon = trendDirection === 'down' ? TrendingDown : TrendingUp;

  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card__top">
        <span className="admin-stat-card__label">{label}</span>
        {Icon && (
          <span
            className="admin-stat-card__icon"
            style={{ background: iconBg }}
          >
            <Icon size={18} color="#ffffff" strokeWidth={2} />
          </span>
        )}
      </div>

      <div className="admin-stat-card__value">{value}</div>

      {trendValue && (
        <div
          className={`admin-stat-card__trend admin-stat-card__trend--${trendDirection}`}
        >
          <TrendIcon size={14} strokeWidth={2.2} />
          <span className="admin-stat-card__trend-value">{trendValue}</span>
          <span className="admin-stat-card__trend-label">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
