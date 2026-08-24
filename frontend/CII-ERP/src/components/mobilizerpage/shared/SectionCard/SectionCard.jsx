import React from 'react';
import './SectionCard.css';

/**
 * SectionCard
 * Generic white rounded card with a title row (and an optional right-aligned
 * header action, e.g. the "View all" link), plus an optional gray subtitle
 * line under the title. Content-agnostic — wraps charts, lists, tables,
 * anything.
 *
 * Props:
 *  - title: string
 *  - subtitle: string (optional)
 *  - headerAction: ReactNode (optional, rendered top-right of the header)
 *  - children: ReactNode
 */
export default function SectionCard({ title, subtitle, headerAction, children }) {
  return (
    <section className="md-section-card">
      <div className="md-section-card__header">
        <div>
          <h2 className="md-section-card__title">{title}</h2>
          {subtitle && <p className="md-section-card__subtitle">{subtitle}</p>}
        </div>
        {headerAction}
      </div>
      <div className="md-section-card__body">{children}</div>
    </section>
  );
}
