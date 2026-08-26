import React from 'react';
import './StatusBadge.css';

/**
 * StatusBadge
 *
 * Small colored pill for a status word (Active, Ending Soon, Completed,
 * Inactive...). Status -> color mapping lives here so any page listing
 * batches, candidates, or tasks can reuse the exact same look, which is
 * why this sits in /shared instead of the Dashboard folder.
 *
 * Props:
 *  - status: string -> the label to display; also used to pick a color
 */
const STATUS_TONE = {
  active: 'green',
  'ending soon': 'orange',
  completed: 'blue',
  inactive: 'grey',
  overdue: 'red',
  /* ---- Attendance Management additions ---- */
  present: 'green',
  late: 'orange',
  absent: 'dark',
  /* ---- Study Material Upload additions ---- */
  published: 'green',
  'pending review': 'orange',
  draft: 'grey',
  /* ---- Task Assigned additions (Priority column pill) ---- */
  high: 'red',
  medium: 'orange',
  low: 'grey',
  /* ---- Profile additions (Document tab pill) ---- */
  verified: 'green',
  /* ---- Events additions ---- */
  upcoming: 'blue',
  ongoing: 'orange',
  cancelled: 'red',
  /* ---- Candidate Management additions ---- */
  blacklisted: 'red',   // 👈 add this
};

const StatusBadge = ({ status }) => {
  const tone = STATUS_TONE[status?.toLowerCase()] || 'grey';

  return <span className={`status-badge status-badge--${tone}`}>{status}</span>;
};

export default StatusBadge;
