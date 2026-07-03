// StatCard.jsx
// Individual summary metric tile.
//
// Props:
//   icon      {string}  – Icon name from Icon component.
//   label     {string}  – Metric label, e.g. "Total Enrolled".
//   value     {string}  – Metric value, e.g. "3" or "48h".
//   iconBg    {string}  – CSS colour / var() for icon background.
//   iconColor {string}  – CSS colour / var() for icon fill.
//
// StatGrid wraps four StatCards in a responsive 4-column grid.
// Backend hookup: replace static STATS array in Dashboard.jsx with
// values from /api/candidate/stats

import Icon from '../../shared/Icon/Icon';
import './StatCard.css';

export function StatCard({ icon, label, value, iconBg, iconColor }) {
  return (
    <div className="stat-card">
      <div
        className="stat-card__icon-wrap"
        style={{ background: iconBg }}
      >
        <Icon name={icon} size={19} color={iconColor} />
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

export function StatGrid({ stats }) {
  return (
    <div className="stat-grid">
      {stats.map(s => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
