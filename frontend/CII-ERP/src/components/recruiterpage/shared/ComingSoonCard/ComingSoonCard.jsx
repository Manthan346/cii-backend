import React from 'react';
import './ComingSoonCard.css';

/**
 * ComingSoonCard (shared)
 *
 * Placeholder empty-state used by any recruiter section that's
 * routed but not built out yet (Job Management, Placement Management,
 * Applications, Notifications, Profile as of this pass). Swap the
 * page's default export for the real component once it's built -
 * this card's only job is to keep routes/imports valid meanwhile.
 *
 * Props:
 *  - title: string        -> section name, shown as the page heading
 *  - description: string  -> one line of context under the heading
 */
const ComingSoonCard = ({ title, description }) => {
  return (
    <div className="coming-soon-card">
      <h1 className="coming-soon-card__title">{title}</h1>
      <p className="coming-soon-card__description">{description}</p>
    </div>
  );
};

export default ComingSoonCard;
