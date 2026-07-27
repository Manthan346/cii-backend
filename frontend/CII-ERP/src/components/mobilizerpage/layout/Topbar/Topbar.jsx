import React, { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bannerImage from "../../assets/topbar-banner.png";
import ciiLogo from "../../assets/cii-logo2.png";
import "./Topbar.css";

/**
 * Topbar
 *
 * Standalone top navigation bar for the Mobilizer panel. Uses the same
 * banner image + CII logo card treatment as the other role panels, and
 * adds a name + role caption next to the avatar (e.g. "Sonal Ahire" /
 * "Mobilizer · Kandivali Centre") to match the Mobilizer Dashboard
 * design.
 *
 * Kept fully self-contained (no /shared imports) so it can be dropped
 * into any layout independently of the Sidebar.
 *
 * Props:
 *  - user: { name, role, avatarUrl }  -> logged-in mobilizer. `avatarUrl` is
 *                                        optional; when absent, initials are
 *                                        derived from `name`.
 *  - hasUnreadNotifications           -> boolean, toggles the red dot on the bell.
 *  - onMenuToggle: function           -> opens a mobile Sidebar drawer, wired from a parent layout.
 *  - onSearch: function(str)          -> fires on Enter in the search input.
 *  - onNotificationClick              -> optional override for the bell click; when omitted,
 *                                        the bell navigates to /mobilizer/notifications.
 *  - onAvatarClick                    -> optional override for the avatar click; when omitted,
 *                                        the avatar navigates to /mobilizer/profile.
 *
 * Backend integration note:
 *  Replace the default `user` below with the authenticated user object
 *  from your auth/session context once it's available. Debounce
 *  `onSearch` in the parent before calling a `/api/search?q=` endpoint.
 */

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Topbar = ({
  user = { name: "Sonal Ahire", role: "Mobilizer · Kandivali Centre" },
  hasUnreadNotifications = true,
  onMenuToggle,
  onSearch,
  onNotificationClick,
  onAvatarClick,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleBellClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      navigate("/mobilizer/notifications");
    }
  };

  const handleAvatarClick = () => {
    if (onAvatarClick) {
      onAvatarClick();
    } else {
      navigate("/mobilizer/profile");
    }
  };

  return (
    <header
      className="mobilizer-topbar"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      {/* Hamburger: mobile only, opens a Sidebar drawer supplied by the parent layout */}
      <button
        type="button"
        className="mobilizer-topbar__hamburger"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Left: CII logo card */}
      <div className="mobilizer-topbar__left">
        <div className="mobilizer-topbar__logo-card">
          <img src={ciiLogo} alt="CII" className="mobilizer-topbar__logo-image" />
          <span className="mobilizer-topbar__logo-caption">
            Confederation of Indian Industry
          </span>
        </div>
      </div>

      {/* Center: search */}
      <div className="mobilizer-topbar__center">
        <div className="mobilizer-topbar__search">
          <Search
            size={18}
            strokeWidth={2}
            className="mobilizer-topbar__search-icon"
          />
          <input
            type="text"
            className="mobilizer-topbar__search-input"
            placeholder="Search courses, classes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right: notifications + name/role + avatar */}
      <div className="mobilizer-topbar__right">
        <button
          type="button"
          className="mobilizer-topbar__bell"
          onClick={handleBellClick}
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.75} />
          {hasUnreadNotifications && (
            <span className="mobilizer-topbar__bell-dot" />
          )}
        </button>

        <button
          type="button"
          className="mobilizer-topbar__profile"
          onClick={handleAvatarClick}
          aria-label={`${user.name} account menu`}
        >
          <span className="mobilizer-topbar__avatar">
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
          </span>
          <span className="mobilizer-topbar__identity">
            <span className="mobilizer-topbar__name">{user.name}</span>
            <span className="mobilizer-topbar__role">{user.role}</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
