import styles from "./ProgressBar.module.css";

/**
 * ProgressBar (Candidate Management)
 *
 * Thin track + numeric percent label, used in the candidate table's
 * "Course" cell to show course progress.
 *
 * NOTE: page-local variant, kept out of /shared because shared/ProgressBar
 * (used by the Dashboard's Batch Overview) has a different design and a
 * different prop API (`value` + `tone` vs `percent`).
 */
export default function ProgressBar({ percent = 0 }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
      <span className={styles.percent}>{clamped}%</span>
    </div>
  );
}
