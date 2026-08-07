// ============================================================================
// AvailableAssessmentItem.jsx
// ----------------------------------------------------------------------------
// A single row inside the "Available" card — assessments not yet attempted.
// "Attempt" calls onAttempt(assessment), which the parent uses to register
// the attempt via startAssessment and open the assessment link.
// ============================================================================

import React from "react";
import Icon from "../../../shared/Icon/Icon";
import StatusBadge from "../../../shared/StatusBadge/StatusBadge";
import "./AvailableAssessmentItem.css";

const AvailableAssessmentItem = ({ assessment, onAttempt, isLoading, errorMessage }) => {
  const { title, course, type, dueLabel, isExpired } = assessment;
  const isQuiz = type === "quiz";

  return (
    <div className="available-item">
      <div className={`available-item__icon ${isQuiz ? "available-item__icon--quiz" : "available-item__icon--assignment"}`}>
        <Icon name={isQuiz ? "clipboard-list" : "file-text"} size={20} />
      </div>

      <div className="available-item__details">
        <p className="available-item__title">{title}</p>
        <p className="available-item__course">
          <Icon name="bookOpen" size={14} />
          <span>{course}</span>
        </p>
        {errorMessage && (
          <p className="available-item__error">{errorMessage}</p>
        )}
      </div>

      <div className="available-item__actions">
        <StatusBadge label={dueLabel} variant={isExpired ? "neutral" : "warning"} />
        <button
          type="button"
          className="available-item__cta"
          onClick={() => onAttempt && onAttempt(assessment)}
          disabled={isLoading || isExpired}
        >
          {isLoading ? "Starting…" : isExpired ? "Expired" : "Attempt"}
        </button>
      </div>
    </div>
  );
};

export default AvailableAssessmentItem;