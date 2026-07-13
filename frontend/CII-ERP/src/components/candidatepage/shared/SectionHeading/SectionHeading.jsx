// src/components/candidatepage/shared/SectionHeading/SectionHeading.jsx
import PropTypes from "prop-types";
import styles from "./SectionHeading.module.css";

/**
 * Small uppercase eyebrow-style heading, e.g. "TODAY TUE, 23 JUN".
 * Reused wherever a schedule day group needs a label.
 */
function SectionHeading({ label, accent }) {
  return (
    <h3 className={styles.heading}>
      {accent && <span className={styles.accent}>{accent}</span>}
      {label}
    </h3>
  );
}

SectionHeading.propTypes = {
  label: PropTypes.string.isRequired,
  accent: PropTypes.string,
};

SectionHeading.defaultProps = {
  accent: "",
};

export default SectionHeading;
