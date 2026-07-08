// AttendanceBanner.jsx
// Amber eligibility warning shown when a course's attendance has
// dropped below the required threshold.
//
// Props:
//   courseName   {string} – course that's below threshold. Pass
//                            null/undefined to render nothing.
//   thresholdPct {number} – eligibility cutoff (default 75)

import Icon from '../../shared/Icon/Icon';
import './AttendanceBanner.css';

export default function AttendanceBanner({ courseName, thresholdPct = 75 }) {
  if (!courseName) return null;

  return (
    <div className="attendance-banner" role="alert">
      <Icon name="alert" size={16} color="#B8892A" />
      <p className="attendance-banner__text">
        Your attendance in <strong>{courseName}</strong> is below the {thresholdPct}% requirement.
        Maintain at least {thresholdPct}% to remain eligible for the final assessment.
      </p>
    </div>
  );
}
