// Sidebar.jsx
// Fixed left navigation panel.
//
// Props:
//   orgLogoSrc  {string|null}  – Organisation logo URL from backend API.
//                                TODO: pass orgData.logoUrl when API is ready.
//   activeItem  {string}       – Label of the currently active nav item.

import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';
import { SidebarLogo } from '../LogoDisplay/LogoDisplay';
import './Sidebar.css';

const NAV_MAIN = [
  { icon: 'dashboard',   label: 'Dashboard',  to: '/'           },
  { icon: 'profile',     label: 'My Profile', to: '/my-profile' },
  { icon: 'courses',     label: 'My Courses', to: '/my-courses' },
  { icon: 'attendance',  label: 'Attendance', to: null          },
];

const NAV_PROGRESS = [
  { icon: 'assessments',  label: 'Assessments',       to: null },
  { icon: 'certificates', label: 'Certificates',      to: null },
  { icon: 'jobs',         label: 'Job Opportunities', to: null },
];

const NAV_SCHEDULE = [
  { icon: 'upcomingClasses',  label: 'Upcoming Classes',       to: null },
];

function NavItem({ icon, label, active, to }) {
  const cls = `sidebar__nav-item${active ? ' sidebar__nav-item--active' : ''}`;
  const iconColor = active ? '#003C7E' : 'rgba(255,255,255,0.78)';
  const content = <><Icon name={icon} size={17} color={iconColor} />{label}</>;

  if (to) {
    return <Link to={to} className={cls} aria-current={active ? 'page' : undefined}>{content}</Link>;
  }
  return <button className={cls}>{content}</button>;
}

function SectionLabel({ children }) {
  return <div className="sidebar__section-label">{children}</div>;
}

export default function Sidebar({ orgLogoSrc = null, activeItem = 'Dashboard', isOpen = false, onClose = () => {} }) {
  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>

      <button className="sidebar__close-btn" onClick={onClose} aria-label="Close menu">✕</button>

      {/* Organisation logo – sourced from backend, read-only */}
      <div className="sidebar__logo-wrap">
        <SidebarLogo src={orgLogoSrc} />
      </div>

      {/* Candidate profile mini-card */}
      {/* TODO: replace hardcoded values with user data from auth context / API */}
      <div className="sidebar__profile">
        <div className="sidebar__avatar">AS</div>
        <div>
          <div className="sidebar__profile-name">Aisha Sheikh</div>
          <div className="sidebar__profile-role">Candidate · Batch DS-24</div>
        </div>
      </div>

      {/* Main navigation */}
      <SectionLabel>Main</SectionLabel>
      {NAV_MAIN.map(item => (
        <NavItem key={item.label} icon={item.icon} label={item.label} to={item.to} active={activeItem === item.label} />
      ))}

      {/* Progress navigation */}
      <SectionLabel>Progress</SectionLabel>
      {NAV_PROGRESS.map(item => (
        <NavItem key={item.label} icon={item.icon} label={item.label} to={item.to} active={activeItem === item.label} />
      ))}

      {/* Schedule navigation */}
      <SectionLabel>Schedule</SectionLabel>
      {NAV_SCHEDULE.map(item => (
        <NavItem key={item.label} icon={item.icon} label={item.label} to={item.to} active={activeItem === item.label} />
      ))}

      {/* Logout */}
      <div className="sidebar__logout-wrap">
        <a href="#" onClick={e => e.preventDefault()} className="sidebar__logout">
          <Icon name="logout" size={17} color="rgba(255,255,255,0.5)" />
          Logout
        </a>
      </div>

    </aside>
  );
}
