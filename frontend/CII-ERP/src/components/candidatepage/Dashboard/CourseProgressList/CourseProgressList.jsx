// CourseProgressList.jsx
// "My Courses" panel — lists enrolled courses only.
//
// CHANGED: progress bars removed per product request. This panel now just
// shows the course name/icon and an "Enrolled" tag instead of a percentage.
//
// Props:
//   courses  {Array}  – [{ id, name, icon?, iconBg?, iconColor? }]
//                       `icon`/`iconBg`/`iconColor` are optional — if a
//                       course doesn't provide them (e.g. live API data that
//                       only has id/name), sensible defaults are used below
//                       so this doesn't break on the current dashboardService
//                       shape ({ id, name, progress }).

import { Link } from 'react-router-dom';
import Icon from '../../shared/Icon/Icon';
import './CourseProgressList.css';

const DEFAULT_ICON = 'book';
const DEFAULT_ICON_BG = '#EEF2FF';
const DEFAULT_ICON_COLOR = '#4F63D2';

function CourseRow({ name, icon, iconBg, iconColor }) {
  return (
    <div className="course-row">
      <div
        className="course-row__icon"
        style={{ background: iconBg ?? DEFAULT_ICON_BG }}
      >
        <Icon name={icon ?? DEFAULT_ICON} size={16} color={iconColor ?? DEFAULT_ICON_COLOR} />
      </div>
      <div className="course-row__info">
        <div className="course-row__name-row">
          <span className="course-row__name">{name}</span>
          <span
            className="course-row__enrolled-tag"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#3B7A3B',
              background: '#E6F4EA',
              padding: '2px 10px',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
            }}
          >
            Enrolled
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CourseProgressList({ courses = [] }) {
  return (
    <div className="dash-my-courses">
      <div className="dash-my-courses__header">
        <span className="dash-my-courses__title">My Courses</span>
        <Link to="/my-courses" className="dash-my-courses__view-all">
          View all
        </Link>
      </div>

      {courses.map(c => (
        <CourseRow
          key={c.id}
          name={c.name}
          icon={c.icon}
          iconBg={c.iconBg}
          iconColor={c.iconColor}
        />
      ))}
    </div>
  );
}