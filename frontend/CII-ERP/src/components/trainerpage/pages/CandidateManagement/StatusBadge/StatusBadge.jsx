import './StatusBadge.css';

/**
 * StatusBadge (Candidate Management)
 *
 * Solid-color pill for a candidate's status (Active / Dropped / Ending Soon).
 *
 * NOTE: page-local variant, kept out of /shared because shared/StatusBadge
 * (used by the Dashboard's Batch Overview) maps a different set of status
 * words to a different, pastel-background visual style.
 */
const STATUS_CLASS = {
  Active: 'active',
  Dropped: 'dropped',
  'Ending Soon': 'ending',
};
export default function StatusBadge({ status }) {
  const toneClass = STATUS_CLASS[status] || 'active';
  return <span className={`${'badge'} ${toneClass}`}>{status}</span>;
}
