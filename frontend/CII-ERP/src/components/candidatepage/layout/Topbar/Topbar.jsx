// Topbar.jsx
// Shared sticky top navigation bar with search and user actions,
// used across the candidate portal (Dashboard, My Courses, Profile).
//
// Props:
//   search       {string}    – Controlled search query value.
//   onSearch     {function}  – Callback(value: string) on input change.
//   onMenuClick  {function}  – Opens the mobile sidebar drawer. Optional;
//                              defaults to a no-op so screens that don't
//                              wire up a mobile drawer still work fine.
//
// ── Update (2026-07-27) ──────────────────────────────────────────
// Avatar initials now always come from useAuthUser() — the old
// `userInitials` prop is REMOVED. Some pages were still passing a
// hardcoded userInitials="AS" leftover from the mock-data days, and since
// that prop used to override the real user, it silently hid the real name
// on any page that still passed it. If any call site still passes
// userInitials={...}, it'll now just be ignored (React drops unknown
// props on a DOM element, but here it's simply unused) — safe to leave in
// place while you clean those call sites up, but worth removing them.
// ──────────────────────────────────────────────────────────────

import { useNavigate } from 'react-router-dom';
import Icon from '../../shared/Icon/Icon';
import { useAuthUser } from '../../../../services/useAuthUser'; // adjust path to wherever useAuthUser.js lives
import './Topbar.css';

export default function Topbar({
  search = '',
  onSearch = () => {},
  onMenuClick = () => {},
}) {
  const navigate = useNavigate();
  const { initials } = useAuthUser();

  return (
    <header className="topbar">

      <button className="topbar__hamburger" onClick={onMenuClick} aria-label="Open menu">
        <span /><span /><span />
      </button>

      {/* Search */}
      <div className="topbar__search">
        <Icon name="search" size={16} color="var(--ink-soft)" />
        <input
          type="search"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search courses, classes..."
          aria-label="Search courses"
        />
      </div>

      {/* Actions */}
      <div className="topbar__actions">

        {/* Notification bell */}
        <button onClick={() => navigate('/notifications')} className="topbar__bell-btn" aria-label="Notifications">
          <Icon name="bell" size={17} color="var(--ink-soft)" />
          {/* TODO: hide dot when there are no unread notifications */}
          <span className="topbar__bell-dot" aria-hidden="true" />
        </button>

        {/* User avatar */}
        {/* TODO: replace initials with <img> when profile photo is available
        <div className="topbar__avatar" role="button" aria-label="User menu" onClick={() => navigate('/my-profile')}>
          {initials}
        </div> */}

      </div>
    </header>
  );
}