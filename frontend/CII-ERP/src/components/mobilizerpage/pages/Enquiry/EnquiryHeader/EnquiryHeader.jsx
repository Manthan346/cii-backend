import React from "react";
import { enquiryInfo } from "../../../data";
import "./EnquiryHeader.css";

/**
 * EnquiryHeader
 *
 * Top block of the Enquiries page: title + one-line description on the
 * left, and a primary "+ Add new Candidate" action on the right (for
 * mobilizers logging a walk-in/phone enquiry directly instead of
 * waiting for a landing-page lead).
 *
 * Props:
 *  - onAddCandidate: function -> fired when the action button is clicked
 */
const EnquiryHeader = ({ onAddCandidate }) => {
  return (
    <div className="enquiry-header">
      <div className="enquiry-header__text">
        <h1 className="enquiry-header__title">{enquiryInfo.title}</h1>
        <p className="enquiry-header__subtitle">{enquiryInfo.subtitle}</p>
      </div>

      <button
        type="button"
        className="enquiry-header__action"
        onClick={onAddCandidate}
      >
        {enquiryInfo.actionLabel}
      </button>
    </div>
  );
};

export default EnquiryHeader;
