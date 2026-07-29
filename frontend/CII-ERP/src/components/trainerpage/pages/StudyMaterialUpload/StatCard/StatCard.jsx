import useCountUp from '../../../shared/hooks/useCountUp';
import './StatCard.css';

/**
 * StatCard (Study Material Upload)
 *
 * Summary card for the Study Material Upload header row ("168 Total
 * Materials", "142 Published", "19 Pending review", "3.1 GB Storage
 * used").
 *
 * tone: 'teal' | 'green' | 'peach' | 'yellow' - controls the square
 * icon badge color, matching the reference design.
 *
 * NOTE: page-local variant, kept out of /shared for the same reason as
 * the Candidate/Batch/Attendance/Resources page StatCards - the exact
 * tone palette here is specific to this page.
 */
export default function StatCard({ icon: Icon, value, label, tone = 'teal' }) {
  const isWholeNumber = typeof value === 'number' && Number.isInteger(value);
  const animatedValue = useCountUp(isWholeNumber ? value : 0, 1200);
  const displayValue = isWholeNumber ? animatedValue : value;
  return (
    <div className={'study-material-upload-stat-card-card'}>
      <div
        className={`study-material-upload-stat-card-icon-wrap study-material-upload-stat-card-${tone || 'teal'}`}
      >
        {Icon && <Icon size={20} strokeWidth={2.25} />}
      </div>
      <div className={'study-material-upload-stat-card-value'}>
        {displayValue}
      </div>
      <div className={'study-material-upload-stat-card-label'}>{label}</div>
    </div>
  );
}
