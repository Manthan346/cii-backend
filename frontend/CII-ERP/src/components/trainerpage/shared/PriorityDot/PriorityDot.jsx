import React from 'react';
import './PriorityDot.css';

/**
 * PriorityDot
 *
 * Tiny colored dot used as a bullet in front of a task/notification
 * title, plus a helper to color-code a priority label (High/Medium/Low).
 * Reused anywhere tasks or notifications are listed (Dashboard's Task
 * Assigned, a future Work/Tasks page), so it belongs in /shared.
 *
 * Props:
 *  - priority: string -> "High" | "Medium" | "Low"
 */
const PRIORITY_TONE = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

const PriorityDot = ({ priority }) => {
  const tone = PRIORITY_TONE[priority?.toLowerCase()] || 'grey';

  return (
    <span className={`priority-dot priority-dot--${tone}`} aria-hidden="true" />
  );
};

export default PriorityDot;
