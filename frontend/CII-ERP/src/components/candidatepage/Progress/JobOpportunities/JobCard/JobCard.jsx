// ============================================================================
// JobCard.jsx
// ----------------------------------------------------------------------------
// A single job opportunity card: <HiringBanner />, title, match percentage,
// Apply button, and a bookmark/save toggle button.
//
// BACKEND NOTE:
//   onApply  -> POST /api/job-opportunities/:jobId/apply
//   onToggleSave -> POST /api/job-opportunities/:jobId/save (toggle bookmark)
// ============================================================================

import React from "react";
import HiringBanner from "../HiringBanner/HiringBanner";
import Icon from "../../../shared/Icon/Icon";
import "./JobCard.css";

const JobCard = ({ job, onApply, onToggleSave }) => {
  const { title, matchPercent, isSaved } = job;

  return (
    <div className="job-card">
      <HiringBanner />

      <h3 className="job-card__title">{title}</h3>
      <p className="job-card__match">{matchPercent} % Match</p>

      <div className="job-card__actions">
        <button
          type="button"
          className="job-card__apply"
          onClick={() => onApply && onApply(job)}
        >
          Apply
        </button>

        <button
          type="button"
          className={`job-card__save ${isSaved ? "job-card__save--active" : ""}`}
          aria-label={isSaved ? `Remove ${title} from saved` : `Save ${title}`}
          aria-pressed={isSaved}
          onClick={() => onToggleSave && onToggleSave(job)}
        >
          <Icon name="share" size={16} color="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
