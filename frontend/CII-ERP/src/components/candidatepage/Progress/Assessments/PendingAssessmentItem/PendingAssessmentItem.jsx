// ============================================================================
// PendingAssessmentItem.jsx
// ----------------------------------------------------------------------------
// A single row inside the "Pending" card (e.g. "SQL Basics Quiz").
// Uses the shared <Icon /> component for the leading badge icon and the
// <StatusBadge /> component for the "Due in X days" pill.
//
// BACKEND NOTE: onStart should route/navigate to the actual assessment
// player, e.g.:
//   const navigate = useNavigate();
//   const handleStart = () => navigate(`/assessments/${assessment.id}/take`);
// ============================================================================

import React from "react";
import Icon from "../../../shared/Icon/Icon";
import StatusBadge from "../../../shared/StatusBadge/StatusBadge";
import "./PendingAssessmentItem.css";

const PendingAssessmentItem = ({ assessment, onStart }) => {
  const { title, course, type, dueLabel, questions, duration, ctaLabel } = assessment;
  const isQuiz = type === "quiz";

  return (
    <div className="pending-item">
      <div className={`pending-item__icon ${isQuiz ? "pending-item__icon--quiz" : "pending-item__icon--assignment"}`}>
        <Icon name={isQuiz ? "clipboard-list" : "file-text"} size={20} />
      </div>

      <div className="pending-item__details">
        <p className="pending-item__title">{title}</p>
        <p className="pending-item__course">
          <Icon name="bookOpen" size={14} />
          <span>{course}</span>
        </p>
        {(questions || duration) && (
          <div className="pending-item__meta">
            {questions && (
              <span className="pending-item__meta-entry">
                <Icon name="helpCircle" size={13} />
                {questions} questions
              </span>
            )}
            {duration && (
              <span className="pending-item__meta-entry">
                <Icon name="clock" size={13} />
                {duration}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pending-item__actions">
        <StatusBadge label={dueLabel} variant="warning" />
        <button type="button" className="pending-item__cta" onClick={() => onStart && onStart(assessment)}>
          {ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default PendingAssessmentItem;