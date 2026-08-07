// ============================================================================
// PendingAssessments.jsx
// ----------------------------------------------------------------------------
// "Pending" card — assessments already submitted, awaiting grading.
// No `onStart` anymore: these have already been attempted, so
// PendingAssessmentItem is informational only.
// ============================================================================

import React from "react";
import PendingAssessmentItem from "../PendingAssessmentItem/PendingAssessmentItem";
import "./PendingAssessments.css";

const PendingAssessments = ({ items = [] }) => {
  return (
    <section className="pending-assessments card">
      <h2 className="pending-assessments__title">Being checked</h2>

      {items.length === 0 ? (
        <p className="pending-assessments__empty">
          Nothing awaiting review right now.
        </p>
      ) : (
        <div className="pending-assessments__list">
          {items.map((assessment) => (
            <PendingAssessmentItem
              key={assessment.id}
              assessment={assessment}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PendingAssessments;