// MyCourses.jsx
// Panel showing enrolled courses with animated progress bars.
// Bars animate from 0 → final % when the component mounts.
//
// Props:
//   courses  {Array}  – Array of { name, pct, icon, barColor } objects.
//                       TODO: populate from /api/candidate/courses
//
// COURSE DATA SHAPE:
//   name     {string}  – Course name
//   pct      {number}  – Completion percentage 0–100
//   emoji    {string}  – Emoji icon shown in the circle
//   bgColor  {string}  – CSS colour for icon circle background
//   barColor {string}  – CSS colour for the progress bar fill

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyCourses.css';

// ── Default data (replace with API) ──
const DEFAULT_COURSES = [
  { name: 'Graphic Design', pct: 78, emoji: '🎨', bgColor: '#F0EBFF', barColor: 'var(--purple)' },
  { name: 'Housekeeping',   pct: 54, emoji: '🏠', bgColor: '#FFF5E0', barColor: 'var(--gold)'   },
  { name: 'Cyber Security', pct: 98, emoji: '🛡️', bgColor: '#FFE8E8', barColor: 'var(--blue)'   },
];

/* ── Animated bar ── */
function CourseRow({ name, pct, emoji, bgColor, barColor, animate }) {
  const fillRef = useRef(null);

  useEffect(() => {
    if (!fillRef.current) return;
    // Small timeout lets the element paint at 0 first, then CSS transition kicks in
    const t = setTimeout(() => {
      if (fillRef.current) {
        fillRef.current.style.width    = animate ? `${pct}%` : `${pct}%`;
        fillRef.current.style.background = barColor;
      }
    }, 80);
    return () => clearTimeout(t);
  }, [pct, barColor, animate]);

  return (
    <div className="course-row">
      <div className="course-row__icon" style={{ background: bgColor }}>
        {emoji}
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

export default function MyCourses({ courses = DEFAULT_COURSES }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on next frame after mount
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="dash-my-courses">
      <div className="dash-my-courses__header">
        <span className="dash-my-courses__title">My Courses</span>
        <Link to="/my-courses" className="dash-my-courses__view-all">
          View all
        </Link>
      </div>

      {courses.map(c => (
        <CourseRow key={c.name} {...c} animate={animate} />
      ))}
    </div>
  );
}
