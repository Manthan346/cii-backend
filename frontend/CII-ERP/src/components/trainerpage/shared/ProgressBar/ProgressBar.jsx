import React, { useEffect, useState } from 'react';
import './ProgressBar.css';

/**
 * ProgressBar
 *
 * Thin horizontal progress track with a filled portion. Used for batch
 * completion in the Dashboard's Batch Overview table, but equally
 * useful on a full Batch Management page or a candidate's course
 * progress, so it's kept in /shared rather than duplicated per page.
 *
 * Props:
 *  - value: number   -> 0-100 percentage filled
 *  - tone: string    -> optional color variant, defaults to teal
 *
 * The fill animates from 0 to `value` on mount (CSS `width` transition
 * in ProgressBar.css does the actual easing; this component just flips
 * the width from 0 -> value one tick after mount to trigger it).
 */
const ProgressBar = ({ value = 0, tone = 'teal' }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(clamped));
    return () => cancelAnimationFrame(raf);
  }, [clamped]);

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`progress-bar__fill progress-bar__fill--${tone}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ProgressBar;
