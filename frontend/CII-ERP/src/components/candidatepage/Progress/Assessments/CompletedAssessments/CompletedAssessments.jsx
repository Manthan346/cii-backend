// ============================================================================
// CompletedAssessments.jsx
// ----------------------------------------------------------------------------
// "Completed" card containing the list of graded/submitted assessments.
//
// BACKEND NOTE: pass the live list down as `items` from Assessments.jsx after
// fetching GET /api/candidates/:id/assessments/completed.
// ============================================================================

import React from "react";
import CompletedAssessmentItem from "../CompletedAssessmentItem/CompletedAssessmentItem";
import { completedAssessments } from "../../../../../data/assessmentsData";
import "./CompletedAssessments.css";

const CompletedAssessments = ({ items = completedAssessments, onReview }) => {
  return (
    <section className="completed-assessments card">
      <h2 className="completed-assessments__title">Completed</h2>

      {items.length === 0 ? (
        <p className="completed-assessments__empty">
          Nothing completed yet — finished assessments will show up here.
        </p>
      ) : (
        <div className="completed-assessments__list">
          {items.map((assessment) => (
            <CompletedAssessmentItem
              key={assessment.id}
              assessment={assessment}
              onReview={onReview}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CompletedAssessments;
