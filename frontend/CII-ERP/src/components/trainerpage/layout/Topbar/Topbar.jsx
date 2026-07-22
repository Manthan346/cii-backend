import React, { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bannerImage from "../../assets/topbar-banner.png";
import ciiLogo from "../../assets/cii-logo.png";
import "./Topbar.css";

/**
 * Topbar
 *
 * Standalone top navigation bar. Uses the provided banner image as a
 * full-width background (cover, no-repeat, centered) and hosts the
 * brand card, search input, notification bell, and user avatar.
 *
 * Kept fully self-contained (no /shared imports) so it can be dropped
 * into any layout independently of the Sidebar.
 *
 * Props:
 *  - user: { name, avatarUrl }   -> logged-in staff user. `avatarUrl` is optional;
 *                                   when absent, initials are derived from `name`.
 *  - hasUnreadNotifications      -> boolean, toggles the red dot on the bell.
 *  - onMenuToggle: function      -> opens a mobile Sidebar drawer, wired from a parent layout.
 *  - onSearch: function(str)     -> fires on Enter in the search input.
 *  - onNotificationClick         -> optional override for the bell click; when omitted,
 *                                   the bell navigates to the existing /staff/notifications page.
 *  - onAvatarClick               -> optional override for the avatar click; when omitted,
 *                                   the avatar navigates to the existing /staff/profile page.
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
  user = { name: "Staff Admin" },
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
      navigate("/trainer/notifications");
    }
  };

  // Avatar click: reuse the parent's handler if one was passed in,
  // otherwise route straight to the existing My Profile page
  // (pages/Profile/Profile/Profile.jsx) - same pattern as the bell
  // above, no new page/dropdown is created here.
  const handleAvatarClick = () => {
    if (onAvatarClick) {
      onAvatarClick();
    } else {
      navigate("/trainer/profile");
    }
  };

  return (
    <header
      className="staff-topbar"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      {/* Hamburger: mobile only, opens a Sidebar drawer supplied by the parent layout */}
      <button
        type="button"
        className="staff-topbar__hamburger"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Left: CII logo card */}
      <div className="staff-topbar__left">
        <div className="staff-topbar__logo-card">
          <img src={ciiLogo} alt="CII" className="staff-topbar__logo-image" />
          <span className="staff-topbar__logo-caption">
            Confederation of Indian Industry
          </span>
        </div>
      </div>

      {/* Center: search */}
      <div className="staff-topbar__center">
        <div className="staff-topbar__search">
          <Search
            size={18}
            strokeWidth={2}
            className="staff-topbar__search-icon"
          />
          <input
            type="text"
            className="staff-topbar__search-input"
            placeholder="Search Batches, candidates....."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right: notifications + avatar */}
      <div className="staff-topbar__right">
        <button
          type="button"
          className="staff-topbar__bell"
          onClick={handleBellClick}
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.75} />
          {hasUnreadNotifications && (
            <span className="staff-topbar__bell-dot" />
          )}
        </button>

        <button
          type="button"
          className="staff-topbar__avatar"
          onClick={handleAvatarClick}
          aria-label={`${user.name} account menu`}
          title={user.name}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="staff-topbar__avatar-image"
            />
          ) : (
            <span className="staff-topbar__avatar-initials">
              {getInitials(user.name)}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
