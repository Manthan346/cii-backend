import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "./JobDetails.module.css";
import ApplyModal from "../ApplyModal/ApplyModal.jsx";
import { getPublicJobPostings } from "../../../../../api/homepage/placementPageService.js";
import { ChevronLeftIcon } from "../icons.jsx";

function LogoBadge({ company }) {
  const initials = company
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return <div className={styles.logo}>{initials}</div>;
}

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadJob() {
      setLoading(true);
      setError("");
      try {
        const result = await getPublicJobPostings({ limit: 50 });
        const foundJob = result.jobs.find((item) => item.id === jobId);
        if (active) setJob(foundJob ?? null);
      } catch {
        if (active) setError("Unable to load this job opening right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJob();
    return () => {
      active = false;
    };
  }, [jobId]);

  if (loading) {
    return <div className={styles.page}>Loading job details...</div>;
  }

  if (error) {
    return <div className={styles.page}>{error}</div>;
  }

  if (!job) {
    return (
      <div className={styles.page}>
        <p>We couldn't find that opening.</p>
        <Link to="/placements">Back to Placements</Link>
      </div>
    );
  }

  const overview = [
    ["Role", job.title],
    ["Company", job.company],
    ["Employment Type", job.employmentType],
    ["Experience", job.experience],
    ["Vacancies", job.vacancy],
    ["Work Mode", job.workMode],
    ["Location", job.location],
    ["Salary", job.salary],
    ["Sector", job.sector],
    ["Qualification", job.qualification],
    ["Percentage / CGPA", job.percentageCgpa],
    ["Deadline", job.deadline],
  ];

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ChevronLeftIcon />
      </button>

      <div className={styles.headerCard}>
        <LogoBadge company={job.company} />
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{job.title}</h1>
          </div>
          <p className={styles.company}>{job.company}</p>
        </div>
        <button
          type="button"
          className={styles.applyBtn}
          onClick={() => setApplyOpen(true)}
        >
          Apply
        </button>
      </div>

      <div className={styles.overviewCard}>
        <h2 className={styles.sectionTitle}>Job Overview</h2>
        <div className={styles.overviewGrid}>
          {overview.map(([label, value]) => (
            <div className={styles.overviewItem} key={label}>
              <span className={styles.overviewLabel}>
                {label.toUpperCase()}
              </span>
              <span className={styles.overviewValue}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Job Description</h2>
        <p className={styles.description}>{job.description}</p>
      </div>

      {applyOpen && (
        <ApplyModal job={job} onClose={() => setApplyOpen(false)} />
      )}
    </div>
  );
}
