// ProfileHeader.jsx
// Top banner of the Profile page: avatar with completion ring,
// candidate identity, status badge, and edit-profile action.
//
// Props:
//   candidate   {object}    – { name, fullName, candidateId, batch, status, avatarSrc, completionPct }
//   onEdit      {function}  – Callback fired when "Edit Profile" is clicked.

import Icon from '../../shared/Icon/Icon';
import './ProfileHeader.css';

export default function ProfileHeader({ candidate, onEdit = () => {} }) {
  const { name, candidateId, batch, status, avatarSrc, completionPct } = candidate;

  return (
    <div className="profile-header">

      <div className="profile-header__avatar-wrap">
        <svg className="profile-header__ring" viewBox="0 0 100 100">
          <circle className="profile-header__ring-bg" cx="50" cy="50" r="46" />
          <circle
            className="profile-header__ring-fg"
            cx="50" cy="50" r="46"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - completionPct / 100)}
          />
        </svg>
        <div className="profile-header__avatar">
          {avatarSrc
            ? <img src={avatarSrc} alt={name} />
            : <span>{name.slice(0, 2).toUpperCase()}</span>}
        </div>
        <div className="profile-header__pct-badge">{completionPct}%</div>
      </div>

      <div className="profile-header__card">
        <div className="profile-header__card-top">
          <div>
            <div className="profile-header__name">{name}</div>
            <div className="profile-header__meta">
              candidate ID: {candidateId} &nbsp;&nbsp; Batch:{batch}
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
            {completionPct}% profile<br />Completed
          </span>
        </div>
      </div>

    </div>
  );
}
