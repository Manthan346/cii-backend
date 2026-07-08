// RecentAttendanceLog.jsx
// "Recent log" panel — chronological list of the latest attendance
// entries across all enrolled courses.
//
// Props:
//   logs      {Array}    – [{ id, date, course, status }]
//   onViewAll {function} – optional handler for the "View all" link
//
// Backend hookup: replace the static `recentLog` array in
// attendanceService.js with the latest entries from the API — this
// component only needs { id, date, course, status }.

import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import './RecentAttendanceLog.css';

export default function RecentAttendanceLog({ logs = [], onViewAll = () => {} }) {
  return (
    <section className="recent-attendance-log" aria-label="Recent attendance log">
      <div className="recent-attendance-log__header">
        <h3 className="recent-attendance-log__title">Recent log</h3>
        <button className="recent-attendance-log__view-all" onClick={onViewAll}>View all</button>
      </div>

      <ul className="recent-attendance-log__items">
        {logs.map(entry => (
          <li key={entry.id} className="recent-attendance-log__item">
            <span className="recent-attendance-log__date">{entry.date}</span>
            <span className="recent-attendance-log__course">{entry.course}</span>
            <StatusBadge status={entry.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}
