import { CheckCircle2, AlertCircle } from 'lucide-react';
import './ProfileCompletionCard.css';

/**
 * ProfileCompletionCard
 *
 * "Profile completion" card shown next to Personal/Guardian Information
 * on the Basic Information tab: a circular progress ring (SVG, no chart
 * library needed for a single ring) plus a checklist of what's done vs
 * missing. Kept as its own component/folder since Profile.jsx composes
 * several tab components and this ring markup is a self-contained unit.
 */
export default function ProfileCompletionCard({
  percent = 0,
  label = '',
  checklist = [],
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.max(0, Math.min(100, percent)) / 100) * circumference;

  return (
    <div className="profile-completion-card">
      <span className="profile-completion-card__badge">Profile completion</span>

      <h3 className="profile-completion-card__label">{label}</h3>

      <div className="profile-completion-card__body">
        <svg
          className="profile-completion-card__ring"
          viewBox="0 0 120 120"
          width="112"
          height="112"
        >
          <circle
            className="profile-completion-card__ring-track"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="10"
          />
          <circle
            className="profile-completion-card__ring-fill"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
          <text
            x="60"
            y="67"
            textAnchor="middle"
            className="profile-completion-card__ring-text"
          >
            {percent}%
          </text>
        </svg>

        <ul className="profile-completion-card__checklist">
          {checklist.map((item) => (
            <li
              key={item.id}
              className="profile-completion-card__checklist-item"
            >
              {item.done ? (
                <CheckCircle2
                  size={16}
                  className="profile-completion-card__icon profile-completion-card__icon--done"
                />
              ) : (
                <AlertCircle
                  size={16}
                  className="profile-completion-card__icon profile-completion-card__icon--pending"
                />
              )}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
