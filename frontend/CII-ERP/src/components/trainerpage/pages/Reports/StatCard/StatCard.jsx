import useCountUp from '../../../shared/hooks/useCountUp';
import './StatCard.css';

/**
 * StatCard (Reports)
 *
 * Summary card for the Reports header row ("38 Total reports",
 * "6 Scheduled", "9 generated this month", "1.2 min Avg. generation
 * time").
 *
 * tone: 'teal' | 'green' | 'peach' | 'yellow' - controls the square
 * icon badge color, matching the reference design.
 *
 * NOTE: page-local variant (like the Resources/Batch/Attendance page
 * StatCards) since this tone palette is specific to the Reports page,
 * so it's kept out of /shared.
 */
export default function StatCard({ icon: Icon, value, label, tone = 'teal' }) {
  // useCountUp rounds to the nearest whole number, which would turn a
  // decimal stat like "1.2 min" into "1 min" once the animation
  // settles - skip the count-up for decimal values and show them as-is.
  const isDecimal = /\d+\.\d+/.test(String(value));
  const animatedValue = useCountUp(value, 1200);
  const displayValue = isDecimal ? value : animatedValue;

  return (
    <div className="reports-stat-card">
      <div
        className={`reports-stat-card__icon reports-stat-card__icon--${tone}`}
      >
        {Icon && <Icon size={20} strokeWidth={2.25} />}
      </div>
      <div className="reports-stat-card__value">{displayValue}</div>
      <div className="reports-stat-card__label">{label}</div>
    </div>
  );
}
