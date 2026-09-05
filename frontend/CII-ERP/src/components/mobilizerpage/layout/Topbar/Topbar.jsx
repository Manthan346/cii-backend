import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import NotificationBell from '../../shared/NotificationBell/NotificationBell';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../../assets/topbar-banner.png';
import './Topbar.css';

/**
 * Topbar (Mobilizer)
 *
 * Standalone top navigation bar for the mobilizer section. Hosts the
 * brand mark, search input, notification bell, and user avatar. Kept
 * fully self-contained (no /shared imports) so it can be dropped into
 * any layout independently of the Sidebar - same pattern as
 * trainer/admin Topbars.
 *
 * NOTE: the brand mark here is a lightweight CSS-only placeholder,
 * same situation as admin's Topbar - no logo image asset was
 * provided. Swap `MobilizerBrandMark` below for an <img src={ciiLogo} />
 * once you drop the asset into mobilizerpage/assets/.
 *
 * NOTE: the bell is now the real <NotificationBell /> (shared component,
 * reads unread state from NotificationsContext) instead of a static icon
 * + dot. This requires <NotificationsProvider> to wrap the app root — see
 * the integration note below this component.
 *
 * Props:
 *  - user: { name, avatarUrl }       -> logged-in mobilizer user. `avatarUrl` is optional;
 *                                       when absent, initials are derived from `name`.
 *  - onMenuToggle: function          -> opens a mobile Sidebar drawer, wired from a parent layout.
 *  - onSearch: function(str)         -> fires on Enter in the search input.
 *  - onNotificationClick: function   -> fires when "View all" is clicked inside the notification
 *                                       dropdown; when omitted, defaults to navigating to
 *                                       /mobilizer/notifications.
 *  - onAvatarClick: function         -> optional override for the avatar click; when omitted,
 *                                       the avatar navigates to /mobilizer/profile.
 *
 * REMOVED: `hasUnreadNotifications` prop — the bell now derives its own
 * unread badge from NotificationsContext, so this is no longer needed.
 * If anything else in the app was passing this prop in, it can be
 * dropped; it's simply ignored now rather than causing an error.
 */
const MobilizerBrandMark = () => (
  <div className="mobilizer-topbar__logo-card">
    <span className="mobilizer-topbar__logo-mark">CII</span>
    <span className="mobilizer-topbar__logo-caption">
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
  user = { name: 'Sonal Mobilizer' },
  onMenuToggle,
  onSearch,
  onNotificationClick,
  onAvatarClick,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleViewAllNotifications = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      navigate('/mobilizer/notifications');
    }
  };

  const handleAvatarClick = () => {
    if (onAvatarClick) {
      onAvatarClick();
    } else {
      navigate('/mobilizer/profile');
    }
  };

  return (
    <header className="mobilizer-topbar" style={{ backgroundImage: `url(${bannerImage})` }}> 
      <button
        type="button"
        className="mobilizer-topbar__hamburger"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="mobilizer-topbar__left">
        <MobilizerBrandMark />
      </div>

      <div className="mobilizer-topbar__center">
        {/* <div className="mobilizer-topbar__search">
          <Search size={18} strokeWidth={2} className="mobilizer-topbar__search-icon" />
          <input
            type="text"
            className="mobilizer-topbar__search-input"
            placeholder="Search courses, classes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search"
          />
        </div> */}
      </div>

      <div className="mobilizer-topbar__right">
        <NotificationBell onViewAll={handleViewAllNotifications} />

        <button
          type="button"
          className="mobilizer-topbar__avatar"
          onClick={handleAvatarClick}
          aria-label={`${user.name} account menu`}
          title={user.name}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="mobilizer-topbar__avatar-image"
            />
          ) : (
            <span className="mobilizer-topbar__avatar-initials">
              {getInitials(user.name)}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Topbar;