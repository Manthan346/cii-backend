import React from 'react';
import './StatusPill.css';

/**
 * StatusPill
 * Small colored badge. Pass `tone` explicitly for full control (safest —
 * used throughout this page), or omit it to fall back to a best-guess
 * mapping from common status text.
 *
 * Props:
 *  - status: string — the label to display
 *  - tone: 'blue' | 'purple' | 'amber' | 'green' | 'red' | 'gray' (optional)
 */
const AUTO_TONE_MAP = {
  new: 'blue',
  upcoming: 'blue',
  today: 'amber',
  'office visit scheduled': 'purple',
  'follow-up required': 'amber',
  approved: 'green',
  pending: 'amber',
  rejected: 'red',
};

export default function StatusPill({ status, tone }) {
  const resolvedTone = tone || AUTO_TONE_MAP[status?.toLowerCase()] || 'gray';
  return <span className={`md-pill md-pill--${resolvedTone}`}>{status}</span>;
}
