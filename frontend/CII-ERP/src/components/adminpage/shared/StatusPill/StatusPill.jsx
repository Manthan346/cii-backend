import React from 'react';
import './StatusPill.css';

/**
 * StatusPill
 *
 * Small colored badge for record status (Pending / Approve / Reject,
 * and reusable for similar states elsewhere - Active/Inactive,
 * Certified/Not certified, etc). Lives in /shared since status pills
 * show up in every list/table across the admin section.
 *
 * Props:
 *  - tone: 'pending' | 'success' | 'danger' | 'neutral'
 *  - children: ReactNode -> pill label
 *  - onClick: function    -> optional, makes the pill an actionable button
 *                            (used for the Approve/Reject actions in
 *                            the Approval requests table)
 */
const StatusPill = ({ tone = 'neutral', children, onClick }) => {
  const className = `admin-status-pill admin-status-pill--${tone}`;

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <span className={className}>{children}</span>;
};

export default StatusPill;
