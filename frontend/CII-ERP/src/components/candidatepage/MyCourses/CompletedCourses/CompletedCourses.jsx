// CompletedCourses.jsx
// "Completed courses" panel — left column of the My Courses progress row.
// Shows finished courses with grade + downloadable certificate.
// Shows an empty state when there are none, instead of hiding the section.
//
// Props:
//   courses  {Array}  – [{ id, icon, iconBg, iconColor, title,
//                          completedDate, professor, grade,
//                          certificateUrl }]
//                       Comes from MyCourses.jsx's computeCompletedCourses(),
//                       derived from /candidate/candidate-academics.
//   onViewAll {func}  – optional handler for the "view all" link

import Icon from "../../shared/Icon/Icon";
import "./CompletedCourses.css";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CompletedRow({ course }) {
  return (
    <li className="completed-courses__item">
      <div
        className="completed-courses__icon"
        style={{ background: course.iconBg }}
      >
        <Icon name={course.icon} size={18} color={course.iconColor} />
      </div>

      <div className="completed-courses__info">
        <div className="completed-courses__name">{course.title}</div>
        <div className="completed-courses__course-name">
          {course.courseName}
        </div>
        <div className="completed-courses__meta">
          {course.company} &middot; {course.trainer} &middot; {course.location}
        </div>
        <div className="completed-courses__dates">
          Enrolled {formatDate(course.enrolledDate)} &middot; Starts{" "}
          {formatDate(course.startingDate)} &middot; Ends{" "}
          {formatDate(course.endDate)}
        </div>
      </div>
    </li>
  );
}

export default function CompletedCourses({ courses = [], onViewAll }) {
  return (
    <section className="completed-courses" aria-label="Completed courses">
      <div className="completed-courses__header">
        <h2 className="completed-courses__title">Completed courses</h2>
        <button
          type="button"
          className="completed-courses__viewall"
          onClick={onViewAll}
        >
          Certificate
          <span>view all</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="completed-courses__empty">
          No completed courses yet — finished courses will show up here.
        </p>
      ) : (
        <ul className="completed-courses__list">
          {courses.map((course) => (
            <CompletedRow key={course.id} course={course} />
          ))}
        </ul>
      )}
    </section>
  );
}
