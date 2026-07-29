import useCountUp from '../../../shared/hooks/useCountUp';
import './StatCard.css';

/**
 * StatCard (Resources)
 *
 * Summary card for the Resources header row ("24 Total resources",
 * "16 Study materials", "6 Added this week", "5 Storage used").
 *
 * tone: 'blue' | 'green' | 'skyblue' | 'yellow' - controls the square
 * icon badge color, matching the reference design.
 *
 * NOTE: page-local variant, kept out of /shared for the same reason as
 * the Candidate/Batch/Attendance page StatCards - the tone palette
 * here (skyblue + yellow in particular) is specific to this page.
 */
export default function StatCard({ icon: Icon, value, label, tone = 'blue' }) {
  const animatedValue = useCountUp(value, 1200);
  return (
    <div className={'card'}>
      <div className={`${'iconWrap'} ${tone || 'blue'}`}>
        {Icon && <Icon size={20} strokeWidth={2.25} />}
      </div>
      <div className={'value'}>{animatedValue}</div>
      <div className={'label'}>{label}</div>
    </div>
  );
}
