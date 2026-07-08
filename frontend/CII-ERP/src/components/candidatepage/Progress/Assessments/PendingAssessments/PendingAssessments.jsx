// ============================================================================
// PendingAssessments.jsx
// ----------------------------------------------------------------------------
// "Pending" card containing the list of not-yet-completed assessments.
//
// BACKEND NOTE: pass the live list down as `items` from Assessments.jsx after
// fetching GET /api/candidates/:id/assessments/pending. `onStart` bubbles up
// so the parent can decide how to navigate to the assessment player.
// ============================================================================

import React from "react";
import PendingAssessmentItem from "../PendingAssessmentItem/PendingAssessmentItem";
import { pendingAssessments } from "../../../../../data/assessmentsData";
import "./PendingAssessments.css";

const PendingAssessments = ({ items = pendingAssessments, onStart }) => {
  return (
    <section className="pending-assessments card">
      <h2 className="pending-assessments__title">Pending</h2>

      {items.length === 0 ? (
        <p className="pending-assessments__empty">
          You're all caught up — no pending assessments right now.
        </p>
      ) : (
        <div className="pending-assessments__list">
          {items.map((assessment) => (
            <PendingAssessmentItem
              key={assessment.id}
              assessment={assessment}
              onStart={onStart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PendingAssessments;
