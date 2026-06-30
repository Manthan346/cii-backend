// MetricCard.jsx
// Stat tile with a smooth count-up animation that runs once on mount.
//
// Each card accepts:
//   icon      {string}  – Icon name (see Icon.jsx PATHS)
//   iconBg    {string}  – CSS colour for icon background
//   iconColor {string}  – CSS colour for icon fill
//   target    {number}  – The final numeric value to count to
//   suffix    {string}  – Optional suffix appended after the number, e.g. "%" or "h"
//   label     {string}  – Description text below the number
//   duration  {number}  – Animation duration in ms (default 1400)
//
// MetricGrid renders four MetricCards in a responsive 4-col grid.
//
// TODO: replace METRIC_DATA in DashboardPage with values from /api/candidate/stats

import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon/Icon';
import './MetricCard.css';

/* ─── useCountUp hook ─────────────────────────────────────────
   Animates a number from 0 → target using requestAnimationFrame.
   Returns the current display value as an integer.
──────────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 1400) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const startVal  = 0;

    function tick(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(startVal + eased * (target - startVal));
      setCurrent(value);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return current;
}

/* ─── Single metric card ───────────────────────────────────── */
export function MetricCard({
  icon,
  iconBg,
  iconColor,
  target    = 0,
  suffix    = '',
  label     = '',
  duration  = 1400,
}) {
  const display = useCountUp(target, duration);

  return (
    <div className="metric-card">
      <div className="metric-card__icon-wrap" style={{ background: iconBg }}>
        <Icon name={icon} size={19} color={iconColor} />
      </div>
      <div className="metric-card__value">
        {display}
        {suffix && <span className="metric-card__suffix">{suffix}</span>}
      </div>
      <div className="metric-card__label">{label}</div>
    </div>
  );
}

/* ─── Grid wrapper ─────────────────────────────────────────── */
export function MetricGrid({ metrics }) {
  return (
    <div className="metric-grid">
      {metrics.map((m, i) => (
        <MetricCard key={m.label} {...m} duration={1200 + i * 100} />
      ))}
    </div>
  );
}
