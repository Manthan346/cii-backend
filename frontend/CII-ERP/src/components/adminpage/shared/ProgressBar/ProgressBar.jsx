import React from 'react';
import './ProgressBar.css';

/**
 * ProgressBar
 *
 * Inline percentage bar used for attendance, course progress, and
 * similar metrics across admin tables (Candidates today; likely
 * Course Management / Reports later). Lives in /shared for that reuse.
 *
 * Color is derived from `value` unless `tone` is passed explicitly:
 *   >= 70  -> green
 *   40-69  -> blue
 *   < 40   -> red
 *
 * Props:
 *  - value: number              -> 0-100
 *  - tone: 'green' | 'blue' | 'red' | 'amber'  -> optional override of the auto color.
 *          'amber' has no auto-selection rule - pass it explicitly (e.g. for an
 *          "Upcoming" course's progress, independent of the percentage value).
 *  - showLabel: boolean         -> renders "NN%" after the bar. Defaults to true.
 */
const toneForValue = (value) => {
  if (value >= 70) return 'green';
  if (value >= 40) return 'blue';
  return 'red';
};

const ProgressBar = ({ value = 0, tone, showLabel = true }) => {
  const resolvedTone = tone || toneForValue(value);
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="admin-progress-bar">
      <span className="admin-progress-bar__track">
        <span
          className={`admin-progress-bar__fill admin-progress-bar__fill--${resolvedTone}`}
          style={{ width: `${clamped}%` }}
        />
      </span>
      {showLabel && (
        <span className="admin-progress-bar__label">{clamped}%</span>
      )}
    </div>
  );
};

export default ProgressBar;
