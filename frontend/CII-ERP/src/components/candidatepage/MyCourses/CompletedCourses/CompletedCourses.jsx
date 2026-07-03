// CompletedCourses.jsx
// "Completed courses" panel — left column of the My Courses progress row.
// Shows finished courses with grade + downloadable certificate.
//
// Props:
//   courses  {Array}  – [{ id, icon, iconBg, iconColor, title,
//                          completedDate, professor, grade,
//                          certificateUrl }]
//                       TODO: from /api/candidate/completed-courses
//   onViewAll {func}  – optional handler for the "view all" link
//
// Backend hookup:
//   const [courses, setCourses] = useState([]);
//   useEffect(() => {
//     fetch('/api/candidate/completed-courses')
//       .then(r => r.json())
//       .then(data => setCourses(data.map(c => ({
//         id: c.id,
//         icon: c.iconName,
//         iconBg: c.iconBgColor,
//         iconColor: c.iconColor,
//         title: c.courseName,
//         completedDate: c.completedOn,
//         professor: c.instructorName,
//         grade: c.grade,
//         certificateUrl: c.certificateDownloadUrl,
//       }))));
//   }, []);

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
  if (!courses.length) return null;

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

      <ul className="completed-courses__list">
        {courses.map(course => (
          <CompletedRow key={course.id} course={course} />
        ))}
      </ul>
    </section>
  );
}
