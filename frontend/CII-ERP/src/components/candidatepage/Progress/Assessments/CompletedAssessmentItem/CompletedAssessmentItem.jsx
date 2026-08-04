// ============================================================================
// CompletedAssessmentItem.jsx
// ----------------------------------------------------------------------------
// A single row inside the "Completed" card (e.g. "Data Visualization - 92%").
// Score color follows a simple threshold rule matching the screenshot:
//   >= 90%  -> green (excellent)
//   75-89%  -> green/teal (good)
//   < 75%   -> amber (needs improvement)
//
// BACKEND NOTE: onReview should route to a read-only results view, e.g.:
//   const navigate = useNavigate();
//   const handleReview = () => navigate(`/assessments/${assessment.id}/results`);
// ============================================================================

import React from "react";
import Icon from "../../../shared/Icon/Icon";
import "./CompletedAssessmentItem.css";

const getScoreClass = (score) => {
  if (score === null || score === undefined) return "completed-item__score--mid";
  if (score >= 90) return "completed-item__score--high";
  if (score >= 75) return "completed-item__score--mid";
  return "completed-item__score--low";
};

const CompletedAssessmentItem = ({ assessment, onReview }) => {
  const { title, course, score, grade, submittedOn } = assessment;

  return (
    <div className="completed-item">
      <div className="completed-item__icon">
        <Icon name="checkCircle" size={20} />
      </div>

      <div className="completed-item__details">
        <p className="completed-item__title">{title}</p>
        <p className="completed-item__course">
          <Icon name="book-open" size={14} />
          <span>{course}</span>
        </p>
        <p className="completed-item__date">
          <Icon name="clock" size={13} />
          {submittedOn}
        </p>
      </div>

      <div className="completed-item__actions">
        <span className={`completed-item__score ${getScoreClass(score)}`}>
          {score !== null && score !== undefined ? `${score}%` : grade ?? "-"}
        </span>
        <button type="button" className="completed-item__cta" onClick={() => onReview && onReview(assessment)}>
          Review
        </button>
      </div>
    </div>
  );
};

export default CompletedAssessmentItem;