import React from 'react';
import './StatusBadge.css';

/**
 * StatusBadge (shared)
 *
 * Small colored "• Label" pill for status columns in any list/table
 * across the recruiter portal (Job Management today, Applications /
 * Placement Management later). Purely presentational - the caller
 * decides the colors, typically from a `xStatusStyles` map next to
 * that section's data (see data/jobManagementData.js's `jobStatusStyles`).
 *
 * Props:
 *  - label: string          -> status text, e.g. "Published"
 *  - bg: string             -> pill background color
 *  - color: string          -> dot + text color
 */
const StatusBadge = ({ label, bg, color }) => {
  return (
    <span className="status-badge" style={{ backgroundColor: bg, color }}>
      <span className="status-badge__dot" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
};

export default StatusBadge;
