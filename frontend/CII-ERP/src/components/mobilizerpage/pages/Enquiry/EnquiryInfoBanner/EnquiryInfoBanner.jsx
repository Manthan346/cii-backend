import React from "react";
import { enquiryInfoBanner } from "../../../data";
import "./EnquiryInfoBanner.css";

/**
 * EnquiryInfoBanner
 *
 * Soft-blue helper strip under the page header explaining what an
 * "Enquiry" is and when a candidate graduates from this list into
 * Enrollments. Copy lives in `enquiryInfoBanner` (data/enquiryData.js)
 * so the wording can change without touching this component; the
 * `highlight` word is rendered bold to match the design.
 */
const EnquiryInfoBanner = () => {
  const { highlight, text } = enquiryInfoBanner;

  return (
    <div className="enquiry-info-banner">
      <p className="enquiry-info-banner__text">
        <strong>{highlight}</strong> {text}
      </p>
    </div>
  );
};

export default EnquiryInfoBanner;
