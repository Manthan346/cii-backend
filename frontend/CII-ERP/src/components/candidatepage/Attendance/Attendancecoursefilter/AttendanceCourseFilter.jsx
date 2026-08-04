// AttendanceCourseFilter.jsx
// Simple dropdown above the calendar for scoping the summary stats
// (overall %, attended/missed counts, banner) to one course/batch.
//
// Props:
//   courses  {Array}    – [{ id, name }]
//   value    {string|number|null} – currently selected course id, or
//                                    null for "All courses"
//   onChange {function} – (id|null) => void
//   loading  {boolean}  – disables the control while options load

import './AttendanceCourseFilter.css';

export default function AttendanceCourseFilter({
  courses = [],
  value = null,
  onChange = () => {},
  loading = false,
}) {
  return (
    <div className="attendance-filter">
      <label className="attendance-filter__label" htmlFor="attendance-course-filter">
        Filter by course
      </label>
      <select
        id="attendance-course-filter"
        className="attendance-filter__select"
        value={value ?? ''}
        disabled={loading}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">All courses</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>
    </div>
  );
}
