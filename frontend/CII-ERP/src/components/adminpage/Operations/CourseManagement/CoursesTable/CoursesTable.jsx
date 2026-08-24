import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import SectionCard from '../../../shared/SectionCard/SectionCard';
import StatusDot from '../../../shared/StatusDot/StatusDot';
import ProgressBar from '../../../shared/ProgressBar/ProgressBar';
import Pagination from '../../../shared/Pagination/Pagination';
import './CoursesTable.css';

const STATUS_META = {
  ongoing: { label: 'Ongoing', dotTone: 'success', barTone: 'green' },
  upcoming: { label: 'Upcoming', dotTone: 'pending', barTone: 'amber' },
  completed: { label: 'Completed', dotTone: 'info', barTone: 'blue' },
};

/**
 * CoursesTable
 *
 * "Courses catalog - N results" list: course identity, batch/duration/
 * size, schedule, trainer, status (dot-style, not a filled pill - see
 * StatusDot), progress bar, and edit/delete row actions.
 *
 * Props:
 *  - courses: array of { id, name, batch, duration, batchSize,
 *             startDate, endDate, trainer, status, progress } - see
 *             data/courseManagementData.js -> coursesCatalogList for
 *             the shape. `status` is one of 'ongoing' | 'upcoming' | 'completed'.
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
    <SectionCard title={`Courses catalog - ${totalResults.toLocaleString()} results`}>
      <div className="admin-table-wrap">
        <table className="admin-courses-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Batch</th>
              <th>Duration</th>
              <th>Batch Size</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Trainer</th>
              <th>Status</th>
              <th>Progress</th>
              <th aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const meta = STATUS_META[course.status] || STATUS_META.ongoing;
              return (
                <tr key={course.id}>
                  <td className="admin-courses-table__name">{course.name}</td>
                  <td>{course.batch}</td>
                  <td>{course.duration}</td>
                  <td>{course.batchSize}</td>
                  <td>{course.startDate}</td>
                  <td>{course.endDate}</td>
                  <td>{course.trainer}</td>
                  <td>
                    <StatusDot tone={meta.dotTone}>{meta.label}</StatusDot>
                  </td>
                  <td>
                    <ProgressBar value={course.progress} tone={meta.barTone} />
                  </td>
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
                      <button
                        type="button"
                        className="admin-courses-table__icon-btn admin-courses-table__icon-btn--danger"
                        onClick={() => onDeleteCourse?.(course.id)}
                        aria-label={`Delete ${course.name}`}
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="admin-courses-table__footer">
        <span className="admin-courses-table__showing">
          Showing {rangeStart}-{rangeEnd} of {totalResults.toLocaleString()} courses
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
