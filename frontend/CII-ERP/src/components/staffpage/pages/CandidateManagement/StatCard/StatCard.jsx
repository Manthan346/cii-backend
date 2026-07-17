import useCountUp from "../../../shared/hooks/useCountUp";
import styles from "./StatCard.module.css";

/**
 * StatCard (Candidate Management)
 *
 * A single summary card (e.g. "128 Total Candidate").
 * icon: lucide-react icon component
 * tone: 'orange' | 'green' | 'gray' | 'blue' - controls the icon badge color
 *
 * NOTE: This is a page-local variant of StatCard, kept inside
 * pages/CandidateManagement instead of /shared because the Dashboard's
 * shared/StatCard already exists with a different visual design (pastel
 * badge, "value: number/tone" API). Keeping both means neither page's
 * look changes when the other is edited.
 *
 * The headline number counts up from 0 to `value` on mount via the
 * shared useCountUp hook.
 */
export default function StatCard({ icon: Icon, value, label, tone = "orange" }) {
  const animatedValue = useCountUp(value, 1500);

  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrap} ${styles[tone] || styles.orange}`}>
        {Icon && <Icon size={20} strokeWidth={2.25} />}
      </div>
      <div className={styles.value}>{animatedValue}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
