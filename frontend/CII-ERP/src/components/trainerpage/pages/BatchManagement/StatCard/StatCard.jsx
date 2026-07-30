import useCountUp from '../../../shared/hooks/useCountUp';
import './StatCard.css';

/**
 * StatCard (Batch Management)
 *
 * Summary card for the Batch List header row ("9 Total batches",
 * "6 Active", "2 Ending Soon", "1 Upcoming"). icon: lucide-react icon
 * component. tone: 'blue' | 'green' | 'peach' | 'gray' - controls the
 * icon badge color, matching the reference design's square badges.
 *
 * NOTE: page-local variant, kept out of /shared for the same reason as
 * the Candidate Management StatCard - the tone palette and badge shape
 * here are specific to the Batch List header.
 */
export default function StatCard({ icon: Icon, value, label, tone = 'blue' }) {
  const animatedValue = useCountUp(value, 1200);
  return (
    <div className={'batch-management-batch-list-stat-card-card'}>
      <div
        className={`batch-management-batch-list-stat-card-icon-wrap batch-management-batch-list-stat-card-${tone || 'blue'}`}
      >
        {Icon && <Icon size={20} strokeWidth={2.25} />}
      </div>
      <div className={'batch-management-batch-list-stat-card-value'}>
        {animatedValue}
      </div>
      <div className={'batch-management-batch-list-stat-card-label'}>
        {label}
      </div>
    </div>
  );
}
