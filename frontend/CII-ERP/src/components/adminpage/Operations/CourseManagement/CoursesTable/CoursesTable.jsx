import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import SectionCard from "../../../shared/SectionCard/SectionCard";
import Pagination from "../../../shared/Pagination/Pagination";
import "./CoursesTable.css";

/**
 * CoursesTable
 *
 * "Courses catalog - N results" list: course identity, description,
 * duration, mode, company, and edit/delete row actions.
 *
 * Props:
 *  - courses: array of { id, name, description, duration, mode,
 *             companyName } - see data/courseManagementData.js ->
 *             coursesCatalogList for the shape. `mode` is e.g.
 *             'online' | 'offline' | 'hybrid', shown as-is
 *             (title-cased).
 *  - pagination: { currentPage, totalPages, pageSize, totalResults }
 *  - onPageChange: function(page)
 *  - onEditCourse / onDeleteCourse: function(id)
 */
const CoursesTable = ({
  courses = [],
  pagination = {},
  onPageChange,
  onEditCourse,
  onDeleteCourse,
}) => {
  const {
    currentPage = 1,
    totalPages = 1,
    pageSize = courses.length,
    totalResults = courses.length,
  } = pagination;

  const rangeStart = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalResults);

  return (
    <SectionCard
      title={`Courses catalog - ${totalResults.toLocaleString()} results`}
    >
      <div className="admin-table-wrap">
        <table className="admin-courses-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Duration</th>
              <th>Mode</th>
              <th>Company</th>
              <th>Functions</th>
              <th aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="admin-courses-table__name">{course.name}</td>
                <td>{course.duration}</td>
                <td className="admin-courses-table__mode">
                  {course.mode
                    ? course.mode.charAt(0).toUpperCase() + course.mode.slice(1)
                    : "—"}
                </td>
                <td>{course.companyName || "—"}</td>
                <td>
                  <div className="admin-courses-table__row-actions">
                    <button
                      type="button"
                      className="admin-courses-table__icon-btn"
                      onClick={() => onEditCourse?.(course.id)}
                      aria-label={`Edit ${course.name}`}
                    >
                      <Pencil size={14} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-courses-table__footer">
        <span className="admin-courses-table__showing">
          Showing {rangeStart}-{rangeEnd} of {totalResults.toLocaleString()}{" "}
          courses
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </SectionCard>
  );
};

export default CoursesTable;
