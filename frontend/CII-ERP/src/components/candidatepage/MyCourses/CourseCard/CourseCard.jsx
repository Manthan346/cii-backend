// CourseCard.jsx
// Single available-course card. Logo is read-only, served by backend.
//
// Props (shape mirrors the courseCards data array):
//   card.id           {number}
//   card.tag          {string}  – Category label, e.g. "RAC SERVICING"
//   card.tagColor     {string}  – Chip background CSS colour
//   card.tagTextColor {string}  – Chip text CSS colour
//   card.company      {string}  – Company / academy name
//   card.desc         {string}  – Short description
//   card.upcoming     {boolean} – Show "UPCOMING" badge when true
//   card.logoSrc      {string|null} – Logo URL from backend API
//
// Backend hookup:
//   card.logoSrc = course.logoUrl  (from /api/courses response)

import { LogoDisplay } from '../LogoDisplay/LogoDisplay';
import Icon from '../Icon/Icon';
import './CourseCard.css';

export default function CourseCard({ card }) {
  return (
    <article className="course-card">

      {/* Upcoming badge */}
      {card.upcoming && (
        <span className="course-card__badge">UPCOMING</span>
      )}

      {/* Logo – populated by backend, no user interaction */}
      <div className="course-card__logo-area">
        <LogoDisplay src={card.logoSrc} alt={card.company} width="100%" height="100%" />
      </div>

      {/* Card body */}
      <div className="course-card__body">

        {/* Category chip */}
        <span
          className="course-card__tag"
          style={{
            background: card.tagColor,
            color: card.tagTextColor,
          }}
        >
          {card.tag}
        </span>

        <div className="course-card__company">{card.company}</div>
        <p className="course-card__desc">{card.desc}</p>

        {/* TODO: wire onClick to course detail page / modal */}
        <button className="course-card__cta">
          Learn more
          <Icon name="arrow" size={15} color="var(--orange)" />
        </button>

      </div>
    </article>
  );
}
