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

import Icon from '../../shared/Icon/Icon';
import './CompletedCourses.css';


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
        <div className="completed-courses__meta">
          completed {course.completedDate} &middot; {course.professor}
        </div>
      </div>

      <span className="completed-courses__grade">{course.grade} Grade</span>

      <a
        className="completed-courses__download"
        href={course.certificateUrl || '#'}
        aria-label={`Download certificate for ${course.title}`}
        onClick={e => { if (!course.certificateUrl) e.preventDefault(); }}
      >
        <Icon name="download" size={15} color="#003C7E" />
      </a>
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
          {courses.map(course => (
            <CompletedRow key={course.id} course={course} />
          ))}
        </ul>
      )}
    </section>
  );
}