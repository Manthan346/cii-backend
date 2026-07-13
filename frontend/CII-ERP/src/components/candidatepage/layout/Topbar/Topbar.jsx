// Topbar.jsx
// Shared sticky top navigation bar with search and user actions,
// used across the candidate portal (Dashboard, My Courses, Profile).
//
// Props:
//   search       {string}    – Controlled search query value.
//   onSearch     {function}  – Callback(value: string) on input change.
//   userInitials {string}    – Two-letter initials shown in the avatar.
//                              TODO: derive from auth context / user API.
//   onMenuClick  {function}  – Opens the mobile sidebar drawer. Optional;
//                              defaults to a no-op so screens that don't
//                              wire up a mobile drawer still work fine.

import { useNavigate } from 'react-router-dom';
import Icon from '../../shared/Icon/Icon';
import './Topbar.css';

export default function Topbar({
  search = '',
  onSearch = () => {},
  userInitials = 'AS',
  onMenuClick = () => {},
}) {
  const navigate = useNavigate();

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
        {/* TODO: replace initials with <img> when profile photo is available */}
        <div className="topbar__avatar" role="button" aria-label="User menu">
          {userInitials}
        </div>

      </div>
    </header>
  );
}