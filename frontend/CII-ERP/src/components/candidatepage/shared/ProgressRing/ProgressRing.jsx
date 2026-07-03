// ProgressRing.jsx
// Small reusable animated circular progress indicator, used by
// CertificateProgress (per-column rings) and CertificateEligibility
// (single large "Overall Eligibility" ring). Same draw-on animation
// technique as AttendanceChart's donut, generalised with size/stroke/color
// props so one component covers both the 56px table rings and the 96px
// summary ring.
//
// Props:
//   percent     {number}  – 0–100
//   size        {number}  – outer diameter in px (default 56)
//   strokeWidth {number}  – ring thickness in px (default 6)
//   color       {string}  – CSS color for the filled arc
//   trackColor  {string}  – CSS color for the background track
//   showLabel   {bool}    – render the percentage as centred text
//   duration    {number}  – animation duration in ms (default 1000)

import { useEffect, useRef, useState } from 'react';
import './ProgressRing.css';

export default function ProgressRing({
  percent = 0,
  size = 56,
  strokeWidth = 6,
  color = '#003C7E',
  trackColor = '#E6EEF8',
  showLabel = true,
  duration = 1000,
}) {
  const fillRef = useRef(null);
  const [displayPct, setDisplayPct] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!fillRef.current) return;

    const target = Math.max(0, Math.min(100, percent));
    const startTime = performance.now();

    fillRef.current.style.strokeDasharray = `${circumference}`;
    fillRef.current.style.strokeDashoffset = `${circumference}`;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(eased * target);

      setDisplayPct(value);

      const filled = (value / 100) * circumference;
      if (fillRef.current) {
        fillRef.current.style.strokeDashoffset = `${circumference - filled}`;
      }

      if (progress < 1) requestAnimationFrame(tick);
    }

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent, circumference, duration]);

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="progress-ring__track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={trackColor}
        />
        <circle
          ref={fillRef}
          className="progress-ring__fill"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      {showLabel && (
        <span className="progress-ring__label" style={{ color }}>
          {displayPct}%
        </span>
      )}
    </div>
  );
}
