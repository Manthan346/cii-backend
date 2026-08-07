import React from 'react';
import './SectionCard.css';

/**
 * SectionCard
 *
 * Generic white card wrapper used for every boxed section on admin
 * dashboards (Candidate Journey, Course Performance, Approval
 * requests, and similar blocks on other pages). Lives in /shared so
 * every dashboard-style page gets the same card chrome for free.
 *
 * Props:
 *  - title: string             -> section heading, e.g. "Course Performance"
 *  - action: ReactNode         -> optional element rendered top-right (e.g. a "View all" link)
 *  - children: ReactNode       -> section body
 */
const SectionCard = ({ title, action, children }) => {
  return (
    <section className="admin-section-card">
      {(title || action) && (
        <div className="admin-section-card__header">
          {title && <h2 className="admin-section-card__title">{title}</h2>}
          {action && <div className="admin-section-card__action">{action}</div>}
        </div>
      )}
      <div className="admin-section-card__body">{children}</div>
    </section>
  );
};

export default SectionCard;
