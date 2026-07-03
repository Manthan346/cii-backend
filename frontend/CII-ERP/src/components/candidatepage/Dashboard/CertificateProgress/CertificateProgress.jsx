// CertificateProgress.jsx
// "Your Certificate Progress Overview" — per-course breakdown of
// Attendance / Assessments / Overall Progress, each as a small ring,
// plus a status badge showing whether the course is certificate-eligible.
//
// Props:
//   courses  {Array}  – [{ id, name, icon, iconBg, iconColor,
//                          attendancePct, assessmentsPct, overallPct,
//                          eligible }]
//                       TODO: from /api/candidate/certificate-progress

import Icon from '../../shared/Icon/Icon';
import ProgressRing from '../../shared/ProgressRing/ProgressRing';
import './CertificateProgress.css';

const BLUE = '#003C7E';
const GREEN = '#0D6E50';
const GOLD = '#B8892A';

function StatusBadge({ eligible }) {
  if (eligible) {
    return (
      <span className="cert-progress__badge cert-progress__badge--eligible">
        <Icon name="certificates" size={13} color={GREEN} />
        Eligible for Certificate
      </span>
    );
  }
  return (
    <span className="cert-progress__badge cert-progress__badge--pending">
      <Icon name="trendingUp" size={13} color={GOLD} />
      Keep going
    </span>
  );
}

function CourseRow({ course }) {
  return (
    <div className="cert-progress__row">
      <div className="cert-progress__course">
        <div className="cert-progress__icon" style={{ background: course.iconBg }}>
          <Icon name={course.icon} size={17} color={course.iconColor} />
        </div>
        <span className="cert-progress__name">{course.name}</span>
      </div>

      <div className="cert-progress__ring-cell">
        <span className="cert-progress__ring-mobile-label">Attendance</span>
        <ProgressRing percent={course.attendancePct} size={56} strokeWidth={6} color={BLUE} trackColor="#E6EEF8" />
      </div>

      <div className="cert-progress__ring-cell">
        <span className="cert-progress__ring-mobile-label">Assessments</span>
        <ProgressRing percent={course.assessmentsPct} size={56} strokeWidth={6} color={BLUE} trackColor="#E6EEF8" />
      </div>

      <div className="cert-progress__ring-cell">
        <span className="cert-progress__ring-mobile-label">Overall Progress</span>
        <ProgressRing percent={course.overallPct} size={56} strokeWidth={6} color={GREEN} trackColor="#E6EEF8" />
      </div>

      <div className="cert-progress__status">
        <StatusBadge eligible={course.eligible} />
      </div>
    </div>
  );
}

export default function CertificateProgress({ courses = [] }) {
  return (
    <div className="cert-progress">
      <h3 className="cert-progress__title">Your Certificate Progress Overview</h3>
      <p className="cert-progress__subtitle">
        Complete both Attendance &amp; Assessments to earn the certification
      </p>

      <div className="cert-progress__table">
        <div className="cert-progress__head">
          <span className="cert-progress__head-cell cert-progress__head-cell--course" />
          <span className="cert-progress__head-cell">
            Attendance
            <small>(Min 85%)</small>
          </span>
          <span className="cert-progress__head-cell">
            Assessments
            <small>(100%)</small>
          </span>
          <span className="cert-progress__head-cell">Overall Progress</span>
          <span className="cert-progress__head-cell" />
        </div>

        {courses.map(course => (
          <CourseRow key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
