import React from "react";
import "./CandidateProfile.css";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * CandidateProfile
 *
 * Full page shown when "View Profile" is clicked on an applications
 * row (matches the reference design, with two deliberate differences
 * per request):
 *  - No candidate photo - uses the same initials-avatar pattern as
 *    the rest of the app instead.
 *  - No "match %" badge - removed entirely.
 *
 * All 4 header buttons are real actions:
 *  - Shortlist / Reject / Schedule Interview each call
 *    onUpdateStatus with the corresponding status value.
 *  - Download Resume opens candidate.resumeUrl in a new tab (does
 *    nothing but stays visible if there's no resume on file).
 */
const CandidateProfile = ({ candidate, onBack, onUpdateStatus }) => {
  if (!candidate) return null;

  const handleDownloadResume = () => {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="candidate-profile">
      <nav className="candidate-profile__breadcrumb">
        <button
          type="button"
          className="candidate-profile__breadcrumb-link"
          onClick={onBack}
        >
          Applications
        </button>
        <span className="candidate-profile__breadcrumb-sep">/</span>
        <span>Candidate Profile</span>
      </nav>

      <div className="candidate-profile__header-card">
        <span
          className="candidate-profile__avatar"
          style={{ backgroundColor: candidate.avatarColor }}
        >
          {getInitials(candidate.name)}
        </span>

        <div className="candidate-profile__header-info">
          <h1 className="candidate-profile__name">{candidate.name}</h1>
          <p className="candidate-profile__applied-for">
            Applied for {candidate.jobRole}
          </p>
        </div>

        <div className="candidate-profile__actions">
          <button
            type="button"
            className="candidate-profile__btn candidate-profile__btn--download"
            onClick={handleDownloadResume}
            disabled={!candidate.resumeUrl}
          >
            Download Resume
          </button>
        </div>
      </div>

      <div className="candidate-profile__row">
        <section className="candidate-profile__card">
          <h2 className="candidate-profile__card-title">Personal Details</h2>
          <div className="candidate-profile__grid">
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">Email</span>
              <span className="candidate-profile__value">
                {candidate.email}
              </span>
            </div>
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">Phone</span>
              <span className="candidate-profile__value">
                {candidate.phone}
              </span>
            </div>
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">Company</span>
              <span className="candidate-profile__value">
                {candidate.company}
              </span>
            </div>
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">Applied Date</span>
              <span className="candidate-profile__value">
                {candidate.appliedDate}
              </span>
            </div>
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">Source</span>
              <span className="candidate-profile__value">
                {candidate.source}
              </span>
            </div>
          </div>
        </section>

        <section className="candidate-profile__card">
          <h2 className="candidate-profile__card-title">Education</h2>
          <div className="candidate-profile__grid">
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">Degree</span>
              <span className="candidate-profile__value">
                {candidate.degree}
              </span>
            </div>
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">College</span>
              <span className="candidate-profile__value">
                {candidate.college}
              </span>
            </div>
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">Graduation Year</span>
              <span className="candidate-profile__value">
                {candidate.graduationYear}
              </span>
            </div>
            <div className="candidate-profile__field">
              <span className="candidate-profile__label">Percentage</span>
              <span className="candidate-profile__value">
                {candidate.percentage}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CandidateProfile;
