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
// ── Consolidation notes (2026-06-30) ───────────────────────────
// Merged from three near-identical copies (Dashboard/Sidebar,
// MyCourses/Sidebar, Profile/Sidebar). All three used the exact
// same visual styling once the CSS class prefix was normalized
// (`dash-sidebar__*` → `sidebar__*` — a naming inconsistency only,
// not an intentional difference). MyCourses' version was the most
// complete: it alone supported a mobile drawer (isOpen/onClose +
// close button + overlay). Dashboard's CSS literally set
// `display: none` on the sidebar under 900px with no way to
// reopen it — a real bug, now fixed for all three screens.
//
// ── Update (2026-07-07) ─────────────────────────────────────────
// Wired the "Attendance" nav item to /attendance now that the
// Attendance page exists. Point this at whatever path your router
// uses if it differs.
//
// ── Visual refresh (2026-07-10) ──────────────────────────────────
// Restyled to match the light/blue reference design (white surface,
// bright-blue active state) instead of the previous solid navy
// sidebar. No routing, props, or state logic changed — see the CSS
// changelog at the top of Sidebar.css for the full list of visual
// changes. Icons swapped from the local <Icon> component to
// lucide-react so the linework matches the reference exactly; if
// <Icon> is used elsewhere in the app that's untouched, this file
// simply no longer imports it.
//
// Usage with the mobile drawer (see shared/Topbar's onMenuClick):
//
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   <Sidebar
//     orgLogoSrc={orgLogoSrc}
//     activeItem="Dashboard"
//     isOpen={sidebarOpen}
//     onClose={() => setSidebarOpen(false)}
//   />
//   {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
//   <Topbar onMenuClick={() => setSidebarOpen(o => !o)} ... />
// ─────────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  CalendarCheck,
  Star,
  Award,
  Briefcase,
  Clock,
  LogOut,
  X,
} from "lucide-react";
import { SidebarLogo } from "../../shared/LogoDisplay/LogoDisplay";
import "./Sidebar.css";

const NAV_MAIN = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/my-dashboard" },
  { icon: User, label: "My Profile", to: "/my-profile" },
  { icon: GraduationCap, label: "My Courses", to: "/my-courses" },
  { icon: CalendarCheck, label: "Attendance", to: "/attendance" },
];

const NAV_PROGRESS = [
  { icon: Star, label: "Assessments", to: "/progress/assessments" },
  { icon: Award, label: "Certificates", to: "/progress/certificates" },
  { icon: Briefcase, label: "Job Opportunities", to: null },
];

const NAV_SCHEDULE = [
  { icon: Clock, label: "Upcoming Classes", to: "/Schedule/upcomingclasses" },
];

function NavItem({ icon: IconComp, label, active, to }) {
  const cls = `sidebar__nav-item${active ? " sidebar__nav-item--active" : ""}`;
  const content = (
    <>
      <IconComp size={18} strokeWidth={2} className="sidebar__nav-icon" />
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
        {/* TODO: replace hardcoded values with user data from auth context / API */}
        <div className="sidebar__profile">
          <div className="sidebar__avatar">AS</div>
          <div>
            <div className="sidebar__profile-name">Aisha Sheikh</div>
            <div className="sidebar__profile-role">Candidate</div>
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
        <SectionLabel>Schedule</SectionLabel>
        {NAV_SCHEDULE.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={activeItem === item.label}
          />
        ))}
      </div>

      {/* Logout */}
      <div className="sidebar__logout-wrap">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="sidebar__logout"
        >
          <LogOut size={17} strokeWidth={2} />
          Logout
        </a>
      </div>
    </aside>
  );
}
