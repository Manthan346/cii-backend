// AttendanceOverview.jsx
// Present/Absent donut summary for the current attendance period.
// Reuses the shared ProgressRing (same draw-on animation as
// CertificateProgress/CertificateEligibility) with its own centred
// two-line label.
//
// Props:
//   presentPct {number} – 0-100
//   absentPct  {number} – 0-100 (kept separate from `100 - presentPct`
//                          so partial periods/holidays can be modelled later)

import ProgressRing from '../../shared/ProgressRing/ProgressRing';
import './AttendanceOverview.css';

export default function AttendanceOverview({ presentPct = 0, absentPct = 0 }) {
  return (
    <section className="attendance-overview" aria-label="Attendance overview">
      <h3 className="attendance-overview__title">Attendance Overview</h3>

      <div className="attendance-overview__body">
        <div className="attendance-overview__ring">
          <ProgressRing
            percent={presentPct}
            size={96}
            strokeWidth={9}
            color="#003C7E"
            trackColor="#E6EEF8"
            showLabel={false}
          />
          <div className="attendance-overview__ring-label">
            <span>Attendance</span>
            <strong>{presentPct}%</strong>
          </div>
        </div>

        <ul className="attendance-overview__legend">
          <li className="attendance-overview__legend-item">
            <i className="attendance-overview__dot attendance-overview__dot--present" />
            <span className="attendance-overview__legend-label">Presents</span>
            <strong className="attendance-overview__legend-value">{presentPct}%</strong>
          </li>
          <li className="attendance-overview__legend-item">
            <i className="attendance-overview__dot attendance-overview__dot--absent" />
            <span className="attendance-overview__legend-label">Absents</span>
            <strong className="attendance-overview__legend-value">{absentPct}%</strong>
          </li>
        </ul>
      </div>
    </section>
  );
}
