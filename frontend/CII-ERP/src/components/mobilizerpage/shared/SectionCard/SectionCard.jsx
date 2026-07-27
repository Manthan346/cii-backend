import React from "react";
import "./SectionCard.css";

/**
 * SectionCard
 *
 * White rounded panel with a bold heading and an optional right-aligned
 * action link (e.g. "View all"). Used to wrap every card-like block on
 * the Dashboard (Daily Enrollments, Candidate Status Distribution,
 * Weekly Calls, Upcoming Job Fairs, Today's Follow-ups) and just as
 * reusable on other mobilizer pages that need the same "card with a
 * title" shell, so it lives in /shared.
 *
 * Props:
 *  - title: string            -> heading text
 *  - actionLabel: string      -> optional label for the top-right link/button
 *  - onActionClick: function  -> optional handler for the action
 *  - className: string        -> optional extra class for layout tweaks
 *  - bare: boolean            -> when true, skips the bottom border under the header
 *  - children: node           -> card body content
 */
const SectionCard = ({
  title,
  actionLabel,
  onActionClick,
  className = "",
  bare = false,
  children,
}) => {
  return (
    <section className={`m-section-card ${className}`}>
      <div className={`m-section-card__header ${bare ? "m-section-card__header--bare" : ""}`}>
        <h2 className="m-section-card__title">{title}</h2>
        {actionLabel && (
          <button
            type="button"
            className="m-section-card__action"
            onClick={onActionClick}
          >
            {actionLabel}
          </button>
        )}
      </div>
      <div className="m-section-card__body">{children}</div>
    </section>
  );
};

export default SectionCard;
