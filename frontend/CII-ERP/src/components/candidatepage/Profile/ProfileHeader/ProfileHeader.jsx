// ProfileHeader.jsx
// Top banner of the Profile page: avatar with completion ring,
// candidate identity, status badge, and edit-profile action.
//
// Props:
//   candidate   {object}    – { name, fullName, candidateId, batch, status, avatarSrc, completionPct }
//   onEdit      {function}  – Callback fired when "Edit Profile" is clicked.

import { useEffect, useState } from 'react';
import Icon from '../../shared/Icon/Icon';
import './ProfileHeader.css';

const RING_R = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;

// Animates the completion ring + percentage badge from 0 up to
// completionPct on mount (ease-out cubic).
function useRingAnimation(completionPct, duration = 1200) {
  const [displayPct, setDisplayPct] = useState(0);
  const [offset, setOffset] = useState(RING_CIRCUMFERENCE);

  useEffect(() => {
    let raf;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * completionPct);
      setDisplayPct(value);
      setOffset(RING_CIRCUMFERENCE * (1 - value / 100));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [completionPct]);

  return { displayPct, offset };
}

export default function ProfileHeader({ candidate, onEdit = () => {} }) {
  const { name, candidateId, batch, status, avatarSrc, completionPct } = candidate;
  const { displayPct, offset } = useRingAnimation(completionPct);

  return (
    <div className="profile-header">

      <div className="profile-header__avatar-wrap">
        <svg className="profile-header__ring" viewBox="0 0 100 100">
          <circle className="profile-header__ring-bg" cx="50" cy="50" r={RING_R} />
          <circle
            className="profile-header__ring-fg"
            cx="50" cy="50" r={RING_R}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="profile-header__avatar">
          {avatarSrc
            ? <img src={avatarSrc} alt={name} />
            : <span>{name.slice(0, 2).toUpperCase()}</span>}
        </div>
        <div className="profile-header__pct-badge">{displayPct}%</div>
      </div>

      <div className="profile-header__card">
        <div className="profile-header__card-top">
          <div className="profile-header__identity">
            <div className="profile-header__name">{name}</div>
            <div className="profile-header__meta">
              <span className="profile-header__meta-id">candidate ID: {candidateId}</span>
              <span className="profile-header__meta-batch">&nbsp;&nbsp;Batch:{batch}</span>
            </div>
          </div>

          <button className="profile-header__edit-btn" onClick={onEdit}>
            <Icon name="edit" size={14} color="var(--blue)" />
            Edit Profile
          </button>
        </div>

        <div className="profile-header__card-bottom">
          <span className="profile-header__status">{status}</span>
          <span className="profile-header__pct-text">
            {displayPct}% profile<br />Completed
          </span>
        </div>
      </div>

    </div>
  );
}
