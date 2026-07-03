// CourseProgressList.jsx
// "My Courses Progress" panel — animated progress bars per enrolled course.
// Consumes the same `courses` shape shared with CertificateProgress, so
// course identity (name/icon) is defined once in mockDashboardData.js.
//
// Props:
//   courses  {Array}  – [{ id, name, icon, iconBg, iconColor, courseProgressPct }]
//                       TODO: from /api/candidate/courses

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../shared/Icon/Icon';
import './CourseProgressList.css';

function CourseRow({ name, icon, iconBg, iconColor, pct, animate }) {
  const fillRef = useRef(null);

  useEffect(() => {
    if (!fillRef.current) return;
    const t = setTimeout(() => {
      if (fillRef.current) {
        fillRef.current.style.width = animate ? `${pct}%` : `${pct}%`;
      }
    }, 80);
    return () => clearTimeout(t);
  }, [pct, animate]);

  return (
    <div className="course-row">
      <div className="course-row__icon" style={{ background: iconBg }}>
        <Icon name={icon} size={16} color={iconColor} />
      </div>
      <div className="course-row__info">
        <div className="course-row__name-row">
          <span className="course-row__name">{name}</span>
          <span className="course-row__pct">{pct}%</span>
        </div>
        <div className="course-row__track">
          <div
            ref={fillRef}
            className="course-row__fill"
            style={{ width: '0%' }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}

export default function CourseProgressList({ courses = [] }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="dash-my-courses">
      <div className="dash-my-courses__header">
        <span className="dash-my-courses__title">My Courses Progress</span>
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
          pct={c.courseProgressPct}
          animate={animate}
        />
      ))}
    </div>
  );
}
