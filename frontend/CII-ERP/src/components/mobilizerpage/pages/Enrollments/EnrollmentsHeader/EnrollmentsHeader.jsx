import React from "react";
import { enrollmentsInfo } from "../../../data";
import "./EnrollmentsHeader.css";

/**
 * EnrollmentsHeader
 *
 * Top block of the Enrollments page: small orange "ENROLLMENTS" eyebrow,
 * page title, and a one-line description of what the page is for.
 * Mirrors the same eyebrow/title/subtitle pattern used by the
 * Dashboard's OverviewHeader, but reads its copy from `enrollmentsInfo`
 * in /data instead of the dashboard's overviewInfo.
 */
const EnrollmentsHeader = () => {
  return (
    <div className="enrollments-header">
      <p className="enrollments-header__eyebrow">{enrollmentsInfo.eyebrow}</p>
      <h1 className="enrollments-header__title">{enrollmentsInfo.title}</h1>
      <p className="enrollments-header__subtitle">{enrollmentsInfo.subtitle}</p>
    </div>
  );
};

export default EnrollmentsHeader;
