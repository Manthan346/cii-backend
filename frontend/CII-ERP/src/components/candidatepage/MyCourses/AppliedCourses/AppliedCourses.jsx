import { LogoDisplay } from '../../shared/LogoDisplay/LogoDisplay';
import './AppliedCourses.css';

const STATUS_MAP = {
  'in-progress': { label: 'In Progress', bg: '#FFF5E0', color: '#B8892A' },
  'completed':   { label: 'Completed',   bg: '#E2F4EE', color: '#0D6E50' },
  'enrolled':    { label: 'Enrolled',    bg: '#E6EEF8', color: '#003C7E' },
};

function AppliedCard({ card }) {
  const status = STATUS_MAP[card.status] || STATUS_MAP['enrolled'];
  return (
    <article className="applied-card">
      <div className="applied-card__logo">
        <LogoDisplay src={card.logoSrc} alt={card.company} size={52} />
      </div>
      <div className="applied-card__info">
        <span
          className="applied-card__tag"
          style={{ background: card.tagColor, color: card.tagTextColor }}
        >
          {card.tag}
        </span>
        <div className="applied-card__company">{card.company}</div>
        <div className="applied-card__progress-row">
          <div className="applied-card__bar-wrap">
            <div
              className="applied-card__bar-fill"
              style={{ width: `${card.progress ?? 0}%` }}
            />
          </div>
          <span className="applied-card__pct">{card.progress ?? 0}%</span>
        </div>
      </div>
      <span
        className="applied-card__status"
        style={{ background: status.bg, color: status.color }}
      >
        {status.label}
      </span>
    </article>
  );
}

export default function AppliedCourses({ cards = [] }) {
  if (!cards.length) return null;
  return (
    <section className="applied-courses" aria-label="Applied Courses">
      <h2 className="applied-courses__title">Applied Courses</h2>
      <div className="applied-courses__list">
        {cards.map(card => (
          <AppliedCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
