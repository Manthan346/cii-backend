import React from "react";
import { UserPlus } from "lucide-react";
import { enrollmentInfoBanner } from "../../../data";
import "./EnrollmentInfoBanner.css";

/**
 * EnrollmentInfoBanner
 *
 * Soft-green helper strip under the page header explaining what the
 * Enrollments list actually is and where submitting the form sends the
 * candidate next. Copy lives in `enrollmentInfoBanner` (data/enrollmentsData.js)
 * so the wording can change without touching this component; the
 * `highlight` word is rendered bold to match the design.
 */
const EnrollmentInfoBanner = () => {
  const { text, highlight, suffix } = enrollmentInfoBanner;

  return (
    <div className="enrollment-info-banner">
      <span className="enrollment-info-banner__icon">
        <UserPlus size={18} strokeWidth={2} />
      </span>
      <p className="enrollment-info-banner__text">
        {text} <strong>{highlight}</strong> {suffix}
      </p>
    </div>
  );
};

export default EnrollmentInfoBanner;
