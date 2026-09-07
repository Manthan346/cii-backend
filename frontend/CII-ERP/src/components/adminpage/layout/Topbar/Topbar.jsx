import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bannerImage from "../../assets/topbar-banner.png";
import "./Topbar.css";

/**
 * Topbar (Admin)
 *
 * Standalone top navigation bar for the admin section. Hosts the brand
 * mark, search input, notification bell, and user avatar.
 *
 * Kept fully self-contained (no /shared imports) so it can be dropped
 * into any layout independently of the Sidebar - same pattern as the
 * trainer Topbar.
 *
 * NOTE: the trainer Topbar imports real banner/logo image assets
 * (../../assets/topbar-banner.png, ../../assets/cii-logo2.png). Those
 * files weren't provided for the admin build, so this version renders
 * a lightweight CSS-only brand mark instead. Swap `AdminBrandMark`
 * below for an <img src={ciiLogo} /> once you drop the asset into
 * adminpage/assets/ - the surrounding markup/classes already match.
 *
 * Props:
 *  - user: { name, avatarUrl }   -> logged-in admin user. `avatarUrl` is optional;
 *                                   when absent, initials are derived from `name`.
 *  - hasUnreadNotifications      -> boolean, toggles the red dot on the bell.
 *  - onMenuToggle: function      -> opens a mobile Sidebar drawer, wired from a parent layout.
 *  - onSearch: function(str)     -> fires on Enter in the search input.
 *  - onNotificationClick         -> optional override for the bell click; when omitted,
 *                                   the bell navigates to /admin/notifications.
 *  - onAvatarClick               -> optional override for the avatar click; when omitted,
 *                                   the avatar navigates to /admin/profile.
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

const AdminBrandMark = () => (
  <div className="admin-topbar__logo-card">
    <span className="admin-topbar__logo-mark">CII</span>
    <span className="admin-topbar__logo-caption">
      Confederation of Indian Industry
    </span>
  </div>
);

const Topbar = ({
  user = { name: "System Admin" },
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
      navigate("/admin/notifications");
    }
  };

  const handleAvatarClick = () => {
    if (onAvatarClick) {
      onAvatarClick();
    } else {
      navigate("/admin/profile");
    }
  };

  return (
    <header
      className="trainer-topbar"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      {/* Hamburger: mobile only, opens a Sidebar drawer supplied by the parent layout */}
      <button
        type="button"
        className="admin-topbar__hamburger"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Left: brand mark */}
      <div className="admin-topbar__left">
        <AdminBrandMark />
      </div>

      {/* Center: search */}
      <div className="admin-topbar__center">
        {/* <div className="admin-topbar__search">
          <Search
            size={18}
            strokeWidth={2}
            className="admin-topbar__search-icon"
          />
          <input
            type="text"
            className="admin-topbar__search-input"
            placeholder="Search courses, classes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search"
          />
        </div> */}
      </div>

      {/* Right: notifications + avatar */}
      <div className="admin-topbar__right">
        <button
          type="button"
          className="admin-topbar__bell"
          onClick={handleBellClick}
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.75} />
          {hasUnreadNotifications && (
            <span className="admin-topbar__bell-dot" />
          )}
        </button>

        <button
          type="button"
          className="admin-topbar__avatar"
          onClick={handleAvatarClick}
          aria-label={`${user.name} account menu`}
          title={user.name}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="admin-topbar__avatar-image"
            />
          ) : (
            <span className="admin-topbar__avatar-initials">
              {getInitials(user.name)}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
