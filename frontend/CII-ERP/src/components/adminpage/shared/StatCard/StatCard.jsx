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
 *  - trendText: string         -> freeform note instead of a % trend, e.g.
 *                                 "no change" - renders plain gray text with
 *                                 no arrow/icon. Takes priority over trendValue.
 *  - layout: 'split' | 'inline' | 'stacked' -> 'split' (default) is label-left/
 *            icon-right, matching Dashboard/Total Users/Candidates. 'inline' puts
 *            the icon beside the label at the top, matching Course Management.
 *            'stacked' puts the icon alone on its own row, then value, then
 *            label, then trend/caption below - matching Approval Requests.
 */
const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg = '#8C7CF0',
  trendValue,
  trendLabel = 'this month',
  trendDirection = 'up',
  trendText,
  layout = 'split',
}) => {
  const TrendIcon = trendDirection === 'down' ? TrendingDown : TrendingUp;

  const trend = trendText ? (
    <div className="admin-stat-card__trend admin-stat-card__trend--neutral">
      <span className="admin-stat-card__trend-label">{trendText}</span>
    </div>
  ) : (
    trendValue && (
      <div
        className={`admin-stat-card__trend admin-stat-card__trend--${trendDirection}`}
      >
        <TrendIcon size={14} strokeWidth={2.2} />
        <span className="admin-stat-card__trend-value">{trendValue}</span>
        <span className="admin-stat-card__trend-label">{trendLabel}</span>
      </div>
    )
  );

  const iconBadge = Icon && (
    <span className="admin-stat-card__icon" style={{ background: iconBg }}>
      <Icon size={18} color="#ffffff" strokeWidth={2} />
    </span>
  );

  if (layout === 'stacked') {
    return (
      <div className="admin-stat-card admin-stat-card--stacked">
        <div className="admin-stat-card__top">{iconBadge}</div>
        <div className="admin-stat-card__value">{value}</div>
        <span className="admin-stat-card__label">{label}</span>
        {trend}
      </div>
    );
  }

  return (
    <div className={`admin-stat-card admin-stat-card--${layout}`}>
      <div className="admin-stat-card__top">
        {layout === 'inline' ? (
          <>
            {iconBadge}
            <span className="admin-stat-card__label">{label}</span>
          </>
        ) : (
          <>
            <span className="admin-stat-card__label">{label}</span>
            {iconBadge}
          </>
        )}
      </div>

      <div className="admin-stat-card__value">{value}</div>

      {trend}
    </div>
  );
};

export default StatCard;
