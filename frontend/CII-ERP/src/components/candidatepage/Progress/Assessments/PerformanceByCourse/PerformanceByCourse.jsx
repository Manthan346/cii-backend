// ============================================================================
// PerformanceByCourse.jsx
// ----------------------------------------------------------------------------
// Right-column card showing a horizontal progress bar per course
// (Graphic Design, Housekeeping, Cyber Security, ...).
//
// BACKEND NOTE: pass `data` down from Assessments.jsx after fetching
// GET /api/candidates/:id/performance-by-course. Each entry needs:
//   { id, course, percentage, color }
// `color` can also be computed on the frontend from a score threshold
// instead of being sent by the API, if you prefer.
// ============================================================================

import React from "react";
import { coursePerformance } from "../../../../../data/assessmentsData";
import "./PerformanceByCourse.css";

const PerformanceByCourse = ({ data = coursePerformance }) => {
  return (
    <section className="performance-by-course card">
      <h2 className="performance-by-course__title">Performance by course</h2>

      <div className="performance-by-course__list">
        {data.map((item) => (
          <div className="performance-row" key={item.id}>
            <span className="performance-row__label">{item.course}</span>
            <div className="performance-row__bar-track">
              <div
                className="performance-row__bar-fill"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span className="performance-row__value">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PerformanceByCourse;
