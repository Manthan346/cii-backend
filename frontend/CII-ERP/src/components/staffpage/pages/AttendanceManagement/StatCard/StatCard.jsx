import useCountUp from "../../../shared/hooks/useCountUp";
import styles from "./StatCard.module.css";

/**
 * StatCard (Attendance Management)
 *
 * Summary card for the Attendance tracker header row ("142 Sessions
 * today", "6 Present", "2 Absent", "90% Avg. attendance").
 *
 * tone: 'teal' | 'green' | 'peach' | 'yellow' - controls the square
 * icon badge color, matching the reference design.
 *
 * NOTE: page-local variant, kept out of /shared for the same reason as
 * the Candidate Management and Batch Management StatCards - the tone
 * palette here (teal + yellow in particular) is specific to this page.
 */
export default function StatCard({ icon: Icon, value, label, tone = "teal" }) {
  const animatedValue = useCountUp(value, 1200);

  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrap} ${styles[tone] || styles.teal}`}>
        {Icon && <Icon size={20} strokeWidth={2.25} />}
      </div>
      <div className={styles.value}>{animatedValue}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
