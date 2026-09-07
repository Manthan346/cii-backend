import React from "react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import "./CoursePerformance.css";

/**
 * CoursePerformance
 *
 * Table of per-course stats from GET /admin/center/course-performance.
 * "Yearly Target" is intentionally NOT rendered — getCoursePerformance
 * doesn't return any target/completion-percentage field, so there's
 * nothing real to show there. Add the column back once the backend
 * exposes one.
 *
 * Props:
 *  - courses: array of { course_id, course, enrolled_candidates,
 *             active_candidates, certificates } — the exact shape
 *             getCoursePerformance returns.
 */
const CoursePerformance = ({ courses = [] }) => {
  return (
    <SectionCard title="Course Performance">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Enrolled Candidates</th>
              <th>Active Candidates</th>
              <th>Certificates</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((row) => (
              <tr key={row.course_id}>
                <td>
                  <span className="admin-table__bullet">•</span>
                  {row.course}
                </td>
                <td>{row.enrolled_candidates}</td>
                <td>{row.active_candidates}</td>
                <td>{row.certificates}</td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="admin-table__empty">
                  No course performance data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
};

export default CoursePerformance;
