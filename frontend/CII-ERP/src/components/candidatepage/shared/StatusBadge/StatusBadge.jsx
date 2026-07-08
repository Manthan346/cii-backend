// StatusBadge.jsx
// Small coloured pill for attendance/session status. Shared so any
// future table or list (not just Attendance) can reuse the same
// Present/Absent/Late/Holiday vocabulary and colours.
//
// Props:
//   status {string} – one of 'present' | 'absent' | 'late' | 'holiday' | 'halfDay' | 'leave'
//   label  {string} – optional override for the displayed text

import './StatusBadge.css';

const STATUS_MAP = {
  present: { label: 'Present', bg: '#E4F6EC', color: '#1B8A4F' },
  absent: { label: 'Absent', bg: '#FBE8E4', color: '#D8432B' },
  late: { label: 'Late', bg: '#FCEFD9', color: '#B8892A' },
  holiday: { label: 'Holiday', bg: '#E6EEF8', color: '#2F6FB0' },
  halfDay: { label: 'Half Day', bg: '#F1E9FB', color: '#7A4FBF' },
  leave: { label: 'Leave', bg: '#EDEFF3', color: '#6B7A94' },
};

export default function StatusBadge({ status, label }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.leave;
  return (
    <span className="status-badge" style={{ background: cfg.bg, color: cfg.color }}>
      {label ?? cfg.label}
    </span>
  );
}
