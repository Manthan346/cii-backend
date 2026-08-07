// ============================================================================
// AvailableAssessments.jsx
// ----------------------------------------------------------------------------
// "Available" card — assessments the candidate hasn't started yet.
// Clicking "Attempt" calls onAttempt(assessment), which the parent uses to
// register the attempt (startAssessment) and navigate to the assessment link.
// ============================================================================

import React from "react";
import AvailableAssessmentItem from "../AvailableAssessmentItem/AvailableAssessmentItem";
import "./AvailableAssessments.css";

const AvailableAssessments = ({ items = [], onAttempt, attemptingId, attemptErrors = {} }) => {
  return (
    <section className="available-assessments card">
      <h2 className="available-assessments__title">Available</h2>

      {items.length === 0 ? (
        <p className="available-assessments__empty">
          No new assessments right now — check back later.
        </p>
      ) : (
        <div className="available-assessments__list">
          {items.map((assessment) => (
            <AvailableAssessmentItem
              key={assessment.id}
              assessment={assessment}
              onAttempt={onAttempt}
              isLoading={attemptingId === assessment.id}
              errorMessage={attemptErrors[assessment.id]}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default AvailableAssessments;