import styles from "./JobCard.module.css";
import { PinIcon, BriefcaseIcon, RupeeIcon } from "../icons.jsx";

// Swap this for real company logo images once you have assets —
// pass job.logoUrl and render an <img> instead when it's present.
function LogoBadge({ company }) {
  const initials = company
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return <div className={styles.logo}>{initials}</div>;
}

export default function JobCard({ job, onSeeDetails, onApply }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <LogoBadge company={job.company} />
          <div className={styles.headerText}>
            <h3 className={styles.title}>{job.title}</h3>
            <p className={styles.company}>{job.company}</p>
          </div>
        </div>
      </div>

      <ul className={styles.metaList}>
        <li className={styles.metaRow}>
          <PinIcon className={styles.metaIcon} />
          <span>{job.location}</span>
        </li>
        <li className={styles.metaRow}>
          <BriefcaseIcon className={styles.metaIcon} />
          <span>
            {job.employmentType}
            {job.experience ? ` . ${job.experience}` : ""}
          </span>
        </li>
        <li className={styles.metaRow}>
          <RupeeIcon className={styles.metaIcon} />
          <span>{job.salary}</span>
        </li>
      </ul>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => onSeeDetails(job)}
        >
          See Details
        </button>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => onApply(job)}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
