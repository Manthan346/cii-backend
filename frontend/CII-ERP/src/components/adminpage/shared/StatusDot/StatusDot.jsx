import React from 'react';
import './StatusDot.css';

/**
 * StatusDot
 *
 * Lightweight status indicator: a colored dot + colored label text,
 * no filled background. Used where StatusPill's solid badge would be
 * too heavy for a dense table - e.g. the Status column in Course
 * Management's Courses catalog (Ongoing / Upcoming / Completed).
 *
 * For the filled-badge look (Pending/Approve/Reject, Active/Inactive,
 * Upcoming/Completed on Short term Training), use StatusPill instead.
 *
 * Props:
 *  - tone: 'success' | 'pending' | 'info' | 'danger' | 'neutral'
 *  - children: ReactNode -> label text
 */
const StatusDot = ({ tone = 'neutral', children }) => {
  return (
    <span className={`admin-status-dot admin-status-dot--${tone}`}>
      <span className="admin-status-dot__dot" />
      {children}
    </span>
  );
};

export default StatusDot;
