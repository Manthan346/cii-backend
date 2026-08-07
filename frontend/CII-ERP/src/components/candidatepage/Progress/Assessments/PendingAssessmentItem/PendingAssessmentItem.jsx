// ============================================================================
// PendingAssessmentItem.jsx
// ----------------------------------------------------------------------------
// A single row inside the "Pending" card — assessments the candidate has
// already submitted and are awaiting grading by the trainer. No action
// button here; it's informational only.
// ============================================================================

import React from "react";
import Icon from "../../../shared/Icon/Icon";
import StatusBadge from "../../../shared/StatusBadge/StatusBadge";
import "./PendingAssessmentItem.css";

const PendingAssessmentItem = ({ assessment }) => {
  const { title, course, type, statusLabel, startedOn } = assessment;
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
        {startedOn && (
          <div className="pending-item__meta">
            <span className="pending-item__meta-entry">
              <Icon name="clock" size={13} />
              {startedOn}
            </span>
          </div>
        )}
      </div>

      <div className="pending-item__actions">
        <StatusBadge label={statusLabel} variant="neutral" />
      </div>
    </div>
  );
};

export default PendingAssessmentItem;