import './StatusBadge.css';

/**
 * StatusBadge (Batch Management)
 *
 * Solid-color pill for a batch's date-derived status, used in the
 * "All Batches" table's Status column.
 *
 * NOTE: page-local variant, kept out of /shared because shared/StatusBadge
 * (used by the Dashboard's Batch Overview) maps a different, pastel set
 * of status words and doesn't include "Upcoming".
 */
const STATUS_CLASS = {
  Active: 'active',
  Expired: 'expired',
  Upcoming: 'upcoming',
};
export default function StatusBadge({ status }) {
  const toneClass = STATUS_CLASS[status] || 'active';
  return (
    <span
      className={`batch-management-batch-list-status-badge-badge batch-management-batch-list-status-badge-${toneClass}`}
    >
      {status}
    </span>
  );
}
