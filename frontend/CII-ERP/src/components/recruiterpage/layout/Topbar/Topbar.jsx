import React, { useRef, useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../../data';
import NotificationsDropdown from '../../Notifications/NotificationsDropdown/NotificationsDropdown';
import bannerImage from '../../assets/topbar-banner.png';
import './Topbar.css';

/**
 * Topbar (Recruiter)
 *
 * Standalone top navigation bar for the recruiter section. Same shape
 * as mobilizerpage's Topbar (brand mark, search, bell, avatar) - fully
 * self-contained - with two differences driven by the reference
 * design: the avatar is paired with the user's name + role stacked
 * next to it, and the bell opens a NotificationsDropdown preview
 * panel instead of navigating straight to the full Notifications page.
 *
 * NOTE: no background banner asset was provided for recruiterpage, so
 * `.recruiter-topbar` uses a CSS-only gradient instead of the
 * `topbar-banner.png` image mobilizer's Topbar imports. Swap in an
 * `assets/topbar-banner.png` + `style={{ backgroundImage: ... }}` the
 * same way mobilizer's Topbar does if/when that asset shows up.
 *
 * Same situation with the brand mark: `RecruiterBrandMark` below is a
 * CSS-only placeholder matching the CII logo card in the screenshot.
 * Swap for an <img src={ciiLogo} /> once the asset is dropped into
 * recruiterpage/assets/.
 *
 * Props:
 *  - user: { name, role, avatarUrl } -> logged-in recruiter. `avatarUrl` is optional;
 *                                       when absent, initials are derived from `name`.
 *  - hasUnreadNotifications: boolean -> overrides the red dot on the bell. When omitted,
 *                                       it's derived from whether any item in
 *                                       data/notificationsData.js has `unread: true`.
 *  - onMenuToggle: function          -> opens a mobile Sidebar drawer, wired from a parent layout.
 *  - onSearch: function(str)         -> fires on Enter in the search input.
 *  - onAvatarClick: function         -> optional override for the avatar click; when omitted,
 *                                       the avatar navigates to /recruiter/profile.
 */
const RecruiterBrandMark = () => (
  <div className="recruiter-topbar__logo-card">
    <span className="recruiter-topbar__logo-mark">CII</span>
    <span className="recruiter-topbar__logo-caption">
      Confederation of Indian Industry
    </span>
  </div>
);

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Topbar = ({
  user = { name: 'Rohan Kapoor', role: 'HR Recruiter' },
  hasUnreadNotifications,
  onMenuToggle,
  onSearch,
  onAvatarClick,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const showUnreadDot = hasUnreadNotifications ?? notifications.some((item) => item.unread);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleAvatarClick = () => {
    if (onAvatarClick) {
      onAvatarClick();
    } else {
      navigate('/recruiter/profile');
    }
  };

  return (
    <header className="recruiter-topbar" style={{ backgroundImage: `url(${bannerImage})` }}>
      <button
        type="button"
        className="recruiter-topbar__hamburger"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="recruiter-topbar__left">
        <RecruiterBrandMark />
      </div>

      <div className="recruiter-topbar__center">
        {/* <div className="recruiter-topbar__search">
          <Search size={18} strokeWidth={2} className="recruiter-topbar__search-icon" />
          <input
            type="text"
            className="recruiter-topbar__search-input"
            placeholder="Search courses, classes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search"
          />
        </div> */}
      </div>

      <div className="recruiter-topbar__right">
        <div className="recruiter-topbar__bell-wrapper">
          <button
            type="button"
            ref={bellRef}
            className="recruiter-topbar__bell"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
          >
            <Bell size={20} strokeWidth={1.75} />
            {showUnreadDot && <span className="recruiter-topbar__bell-dot" />}
          </button>

          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            anchorRef={bellRef}
          />
        </div>

        <button
          type="button"
          className="recruiter-topbar__profile"
          onClick={handleAvatarClick}
          aria-label={`${user.name} account menu`}
        >
          <span className="recruiter-topbar__avatar">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="recruiter-topbar__avatar-image"
              />
            ) : (
              <span className="recruiter-topbar__avatar-initials">
                {getInitials(user.name)}
              </span>
            )}
          </span>
          {/* <span className="recruiter-topbar__profile-text">
            <span className="recruiter-topbar__profile-name">{user.name}</span>
            {user.role && (
              <span className="recruiter-topbar__profile-role">{user.role}</span>
            )}
          </span> */}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
