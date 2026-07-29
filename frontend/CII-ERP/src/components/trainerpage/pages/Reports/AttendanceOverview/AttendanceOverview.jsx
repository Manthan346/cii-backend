import { SectionCard, ProgressBar } from '../../../shared';
import './AttendanceOverview.css';

/**
 * AttendanceOverview (Reports)
 *
 * "Attendance overview by batch" panel on the Reports page: for each
 * batch shows its label + completion percentage, with a full-width
 * progress bar underneath. Built with the reusable <SectionCard> and
 * <ProgressBar> from /shared - only the row layout is page-specific.
 */
export default function AttendanceOverview({ title, rows = [] }) {
  return (
    <SectionCard title={title} className="attendance-overview">
      <div className="attendance-overview__list">
        {rows.map((row) => (
          <div className="attendance-overview__row" key={row.id}>
            <div className="attendance-overview__row-head">
              <span className="attendance-overview__label">{row.label}</span>
              <span className="attendance-overview__value">{row.value}%</span>
            </div>
            <ProgressBar value={row.value} tone="teal" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
