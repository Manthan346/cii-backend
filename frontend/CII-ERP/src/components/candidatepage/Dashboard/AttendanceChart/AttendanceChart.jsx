// AttendanceChart.jsx
// Animated SVG donut chart showing attendance % with a smooth draw-on animation.
// The arc draws from 0 → present% when the component mounts.
//
// Props:
//   present  {number}  – Present percentage 0–100. TODO: from /api/candidate/attendance
//   absent   {number}  – Absent percentage (derived if omitted)

import { useEffect, useRef, useState } from 'react';
import './AttendanceChart.css';

const RADIUS      = 52;   // SVG circle radius
const STROKE_W    = 14;   // stroke width (matches CSS donut-track / donut-fill)
const CX = 70;            // circle centre x  (viewBox 140×140)
const CY = 70;            // circle centre y
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;  // ≈ 326.7

export default function AttendanceChart({ present = 85, absent }) {
  const absentPct  = absent ?? (100 - present);
  const fillRef    = useRef(null);
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    if (!fillRef.current) return;

    const target     = present;
    const duration   = 1400;
    const startTime  = performance.now();

    function tick(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);   // ease-out cubic
      const value    = Math.round(eased * target);

      setDisplayPct(value);

      // SVG dash trick: full circumference = 100%, offset pulls it back
      const filled  = (value / 100) * CIRCUMFERENCE;
      const offset  = CIRCUMFERENCE - filled;
      fillRef.current.style.strokeDasharray  = `${CIRCUMFERENCE}`;
      fillRef.current.style.strokeDashoffset = `${offset}`;

      if (progress < 1) requestAnimationFrame(tick);
    }

    // Start from fully hidden
    fillRef.current.style.strokeDasharray  = `${CIRCUMFERENCE}`;
    fillRef.current.style.strokeDashoffset = `${CIRCUMFERENCE}`;

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [present]);

  return (
    <div className="attendance-chart">
      <div className="attendance-chart__title">Attendance Overview</div>

      <div className="attendance-chart__body">

        {/* ── Donut ── */}
        <div className="attendance-chart__donut-wrap">
          <svg viewBox="0 0 140 140" aria-hidden="true">
            {/* Background track */}
            <circle
              className="donut-track"
              cx={CX} cy={CY} r={RADIUS}
              strokeWidth={STROKE_W}
            />
            {/* Animated fill arc */}
            <circle
              ref={fillRef}
              className="donut-fill"
              cx={CX} cy={CY} r={RADIUS}
              strokeWidth={STROKE_W}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
            />
          </svg>

          {/* Centre label */}
          <div className="attendance-chart__centre">
            <span className="attendance-chart__centre-label">Attendance</span>
            <span className="attendance-chart__centre-pct">{displayPct}%</span>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="attendance-chart__legend">
          <div className="legend-row">
            <div className="legend-row__label">
              <span className="legend-row__dot" style={{ background: 'var(--blue)' }} />
              Presents
            </div>
            <div className="legend-row__value">{present}%</div>
          </div>

          <div className="legend-row">
            <div className="legend-row__label">
              <span className="legend-row__dot" style={{ background: 'var(--blue-light)' }} />
              Absents
            </div>
            <div className="legend-row__value">{absentPct}%</div>
          </div>
        </div>

      </div>
    </div>
  );
}
