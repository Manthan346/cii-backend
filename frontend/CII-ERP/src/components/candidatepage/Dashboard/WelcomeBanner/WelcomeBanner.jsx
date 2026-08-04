// WelcomeBanner.jsx
// Blue hero banner: avatar and greeting.
//
// CHANGED: streak and certificate badges removed per product request —
// this component no longer takes streakDays/certificates props at all,
// since neither is displayed anymore.
//
// Props:
//   name      {string}       – Candidate first name.  TODO: from auth context.
//   subText   {string}       – Motivational line, e.g. "3 sessions away …".
//   avatarSrc {string|null}  – Profile photo URL.      TODO: from /api/candidate/profile.

import './WelcomeBanner.css';

export default function WelcomeBanner({
  name    = 'Anisha',
  subText = "You're 3 sessions away from completing. Keep going!",
  avatarSrc = null,
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
        </div>
      </div>

    </div>
  );
}