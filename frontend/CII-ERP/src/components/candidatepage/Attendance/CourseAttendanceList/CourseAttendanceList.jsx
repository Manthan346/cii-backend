// CourseAttendanceList.jsx
// "By Courses" panel — per-course attendance percentage with a
// coloured progress bar (flips red below the eligibility threshold).
//
// Props:
//   courses   {Array}    – [{ id, icon, iconBg, iconColor, name, pct }]
//   onViewAll {function} – optional handler for the "View all" link
//   threshold {number}   – eligibility cutoff, default 75
//
// Backend hookup: replace the static `courses` array in
// attendanceService.js with per-course attendance from the API —
// this component only needs { id, icon, iconBg, iconColor, name, pct }.

import Icon from '../../shared/Icon/Icon';
import './CourseAttendanceList.css';

export default function CourseAttendanceList({ courses = [], onViewAll = () => {}, threshold = 75 }) {
  return (
    <section className="course-attendance-list" aria-label="Attendance by course">
      <div className="course-attendance-list__header">
        <h3 className="course-attendance-list__title">By Courses</h3>
        <button className="course-attendance-list__view-all" onClick={onViewAll}>View all</button>
      </div>

      <ul className="course-attendance-list__items">
        {courses.map(course => {
          const below = course.pct < threshold;
          return (
            <li key={course.id} className="course-attendance-list__item">
              <span className="course-attendance-list__icon" style={{ background: course.iconBg }}>
                <Icon name={course.icon} size={14} color={course.iconColor} />
              </span>
              <div className="course-attendance-list__info">
                <div className="course-attendance-list__row">
                  <span className="course-attendance-list__name">{course.name}</span>
                  <span className={`course-attendance-list__pct${below ? ' course-attendance-list__pct--low' : ''}`}>
                    {course.pct}%
                  </span>
                </div>
                <div className="course-attendance-list__bar-track">
                  <div
                    className={`course-attendance-list__bar-fill${below ? ' course-attendance-list__bar-fill--low' : ''}`}
                    style={{ width: `${course.pct}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
