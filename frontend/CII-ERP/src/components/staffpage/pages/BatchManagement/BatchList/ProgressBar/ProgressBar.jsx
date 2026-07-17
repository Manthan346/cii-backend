import { useEffect, useState } from "react";
import useCountUp from "../../../../shared/hooks/useCountUp";
import styles from "./ProgressBar.module.css";

/**
 * ProgressBar (Batch Management)
 *
 * Thin track + trailing numeric percent label, used in the Batch
 * table's "Course" cell under the course name to show completion.
 *
 * NOTE: page-local variant, kept out of /shared because shared/ProgressBar
 * (used by the Dashboard's Batch Overview) has a different prop API
 * (`value` + `tone`) and doesn't render the numeric label inline.
 */
export default function ProgressBar({ percent = 0 }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const [width, setWidth] = useState(0);
  const animatedPercent = useCountUp(clamped);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(clamped));
    return () => cancelAnimationFrame(raf);
  }, [clamped]);

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${width}%` }} />
      </div>
      <span className={styles.percent}>{animatedPercent}%</span>
    </div>
  );
}
