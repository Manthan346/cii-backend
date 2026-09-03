// Sidebar.jsx
// Shared fixed left navigation panel used across the candidate
// portal (Dashboard, My Courses, Profile, Attendance).
//
// Props:
//   orgLogoSrc  {string|null}  – Organisation logo URL from backend API.
//                                TODO: pass orgData.logoUrl when API is ready.
//   activeItem  {string}       – Label of the currently active nav item.
//   isOpen      {boolean}      – Whether the mobile drawer is open. Optional;
//                                defaults to false (closed / desktop layout).
//   onClose     {function}     – Closes the mobile drawer. Optional no-op
//                                default so screens that don't wire up a
//                                mobile toggle still render correctly.
//
// ── Update (2026-07-27) ──────────────────────────────────────────
// Profile mini-card (avatar + name/role) now pulled from useAuthUser()
// instead of hardcoded "AS" / "Aisha Sheikh" / "Candidate". Logout link
// now actually logs out (see useAuthUser.logout) instead of being a
// preventDefault() no-op.
//
// ── Update (2026-08-03) ───────────────────────────────────────────
// Fixed: NAV_PROGRESS entries use string icon names (e.g. 'assessments',
// 'upload') meant to be looked up in the custom Icon component's PATHS
// map, but NavItem was rendering `icon` directly as a JSX tag
// (`<IconComp .../>`), which only works for the lucide-react component
// references used by NAV_MAIN/NAV_SCHEDULE. A string there just produced
// an unrecognized lowercase tag with nothing visible. NavItem now checks
// typeof icon and renders through the custom Icon component when it's a
// string. Also: `icon` was imported but never used — renamed to `Icon`
// (matching the component-name convention) since it's the thing that
// actually fixes this.
// ──────────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  Star,
  Award,
  Briefcase,
  Clock,
  Bell,
  LogOut,
  X,
} from "lucide-react";
import { SidebarLogo } from "../../shared/LogoDisplay/LogoDisplay";
import { useAuthUser } from "../../../../services/useAuthUser"; // adjust path to wherever useAuthUser.js lives
import Icon from "../../shared/Icon/Icon";
//import orgLogo from "../../../../assets/Logo.png";
import "./Sidebar.css";

const NAV_MAIN = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/my-dashboard" },
  { icon: User, label: "My Profile", to: "/my-profile" },
  { icon: GraduationCap, label: "My Courses", to: "/my-courses" },
  { icon: CalendarCheck, label: "Attendance", to: "/attendance" },
  { icon: Bell, label: "Notifications", to: "/notifications" },
  // { icon: ClipboardList,   label: "Task",       to: "/tasks"        },
];

const NAV_PROGRESS = [
  { icon: "assessments", label: "Assessments", to: "/progress/assessments" },
  { icon: "upload", label: "Study Material", to: "/progress/studymaterial" },
  { icon: "certificate", label: "Certificates", to: "/progress/certificates" },
  // { icon: 'jobs',         label: 'Job Opportunities', to: '/progress/jobopportunities' },
];

const NAV_SCHEDULE = [
  { icon: Clock, label: "Upcoming Classes", to: "/Schedule/upcomingclasses" },
];

function NavItem({ icon, label, active, to }) {
  const cls = `sidebar__nav-item${active ? " sidebar__nav-item--active" : ""}`;

  // NAV_MAIN / NAV_SCHEDULE pass lucide-react component references;
  // NAV_PROGRESS passes plain strings that map to the custom Icon
  // component's PATHS. Render each the way it actually needs to be
  // rendered instead of assuming one shape for both.
  let iconEl;
  if (typeof icon === "string") {
    iconEl = (
      <Icon
        name={icon}
        size={18}
        color="currentColor"
        className="sidebar__nav-icon"
      />
    );
  } else {
    const IconComp = icon;
    iconEl = (
      <IconComp size={18} strokeWidth={2} className="sidebar__nav-icon" />
    );
  }

  const content = (
    <>
      {iconEl}
      <span>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} aria-current={active ? "page" : undefined}>
        {content}
      </Link>
    );
  }
  return <button className={cls}>{content}</button>;
}

function SectionLabel({ children }) {
  return <div className="sidebar__section-label">{children}</div>;
}

export default function Sidebar({
  orgLogoSrc = SidebarLogo,
  activeItem = "Dashboard",
  isOpen = false,
  onClose = () => {},
}) {
  const { fullName, initials, role, logout } = useAuthUser();

  return (
    <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`}>
      <button
        className="sidebar__close-btn"
        onClick={onClose}
        aria-label="Close menu"
      >
        <X size={16} strokeWidth={2.5} />
      </button>

      <div className="sidebar__scroll">
        {/* Organisation logo – sourced from backend, read-only */}
        <div className="sidebar__logo-card">
          <div className="sidebar__logo-wrap">
            <SidebarLogo src={orgLogoSrc} />
          </div>
        </div>

        {/* Candidate profile mini-card */}
        <div className="sidebar__profile">
          <div className="sidebar__avatar">{initials}</div>
          <div>
            <div className="sidebar__profile-name">{fullName || ""}</div>
            <div className="sidebar__profile-role">{role}</div>
          </div>
        </div>

        {/* Main navigation */}
        <SectionLabel>Main</SectionLabel>
        {NAV_MAIN.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={activeItem === item.label}
          />
        ))}

        {/* Progress navigation */}
        <SectionLabel>Progress</SectionLabel>
        {NAV_PROGRESS.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={activeItem === item.label}
          />
        ))}

        {/* Schedule navigation */}
        {/* <SectionLabel>Schedule</SectionLabel>
        {NAV_SCHEDULE.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={activeItem === item.label}
          />
        ))} */}
      </div>

      {/* Logout */}
      <div className="sidebar__logout-wrap">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          className="sidebar__logout"
        >
          <LogOut size={17} strokeWidth={2} />
          Logout
        </a>
      </div>
    </aside>
  );
}
