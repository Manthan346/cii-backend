// WelcomeBanner.jsx
// Blue hero banner: avatar, greeting, motivational sub-text, streak & certificate badges.
//
// Props:
//   name         {string}       – Candidate first name.  TODO: from auth context.
//   subText      {string}       – Motivational line, e.g. "3 sessions away …".
//   streakDays   {number}       – Current daily streak.  TODO: from /api/candidate/stats.
//   certificates {number}       – Certificates earned.   TODO: from /api/candidate/stats.
//   avatarSrc    {string|null}  – Profile photo URL.      TODO: from /api/candidate/profile.

import './WelcomeBanner.css';

export default function WelcomeBanner({
  name         = 'Anisha',
  subText      = "You're 3 sessions away from completing. Keep going!",
  streakDays   = 12,
  certificates = 4,
  avatarSrc    = null,
}) {
  return (
    <div className="welcome-banner">

      {/* Avatar + greeting */}
      <div className="welcome-banner__left">
        <div className="welcome-banner__avatar">
          {avatarSrc
            ? <img src={avatarSrc} alt={name} />
            : name.charAt(0).toUpperCase()
          }
        </div>
        <div>
          <div className="welcome-banner__title">Welcome back, {name}</div>
          <div className="welcome-banner__sub">{subText}</div>
        </div>
      </div>

      {/* Streak + certificates badges */}
      <div className="welcome-banner__badges">
        <div className="welcome-banner__badge">
          <span className="welcome-banner__badge-icon">🔥</span>
          {streakDays}-day streak
        </div>
        <div className="welcome-banner__badge">
          <span className="welcome-banner__badge-icon">🏆</span>
          {certificates} Certificates
        </div>
      </div>

    </div>
  );
}
