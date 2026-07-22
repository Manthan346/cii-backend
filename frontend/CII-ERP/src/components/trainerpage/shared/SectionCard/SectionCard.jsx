import React from "react";
import "./SectionCard.css";

/**
 * SectionCard
 *
 * White rounded panel with an underlined heading and an optional
 * right-aligned action (e.g. "View all"). Used to wrap every card-like
 * block on the Dashboard (Batch Overview, Task Assigned, Attendance,
 * Recent Uploads) and just as reusable on other staff pages that need
 * the same "card with a title" shell, so it lives in /shared.
 *
 * Props:
 *  - title: string            -> heading text
 *  - actionLabel: string      -> optional label for the top-right link/button
 *  - onActionClick: function  -> optional handler for the action
 *  - className: string        -> optional extra class for layout tweaks
 *  - children: node           -> card body content
 */
const SectionCard = ({
  title,
  actionLabel,
  onActionClick,
  className = "",
  children,
}) => {
  return (
    <section className={`section-card ${className}`}>
      <div className="section-card__header">
        <h2 className="section-card__title">{title}</h2>
        {actionLabel && (
          <button
            type="button"
            className="section-card__action"
            onClick={onActionClick}
          >
            {actionLabel}
          </button>
        )}
      </div>
      <div className="section-card__body">{children}</div>
    </section>
  );
};

export default SectionCard;
