// Sidebar.jsx
// Fixed left navigation panel matching the dashboard screenshot.
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
  const cls = `dash-sidebar__nav-item${active ? ' dash-sidebar__nav-item--active' : ''}`;
  const iconColor = active ? '#003C7E' : 'rgba(255,255,255,0.78)';
  const content = <><Icon name={icon} size={17} color={iconColor} />{label}</>;

  if (to) {
    return <Link to={to} className={cls} aria-current={active ? 'page' : undefined}>{content}</Link>;
  }
  return <button className={cls}>{content}</button>;
}

function SectionLabel({ children }) {
  return <div className="dash-sidebar__section-label">{children}</div>;
}

export default function Sidebar({ orgLogoSrc = null, activeItem = 'Dashboard' }) {
  return (
    <aside className="dash-sidebar">

      <div className="dash-sidebar__logo-wrap">
        <SidebarLogo src={orgLogoSrc} />
      </div>

      <div className="dash-sidebar__profile">
        <div className="dash-sidebar__avatar">AS</div>
        <div>
          <div className="dash-sidebar__profile-name">Aisha Sheikh</div>
          <div className="dash-sidebar__profile-role">Candidate · Batch DS-24</div>
        </div>
      </div>

      <SectionLabel>Main</SectionLabel>
      {NAV_MAIN.map(item => (
        <NavItem key={item.label} icon={item.icon} label={item.label} to={item.to} active={activeItem === item.label} />
      ))}

      <SectionLabel>Progress</SectionLabel>
      {NAV_PROGRESS.map(item => (
        <NavItem key={item.label} icon={item.icon} label={item.label} to={item.to} active={activeItem === item.label} />
      ))}

      {/* Schedule navigation */}
      <SectionLabel>Schedule</SectionLabel>
      {NAV_SCHEDULE.map(item => (
        <NavItem key={item.label} icon={item.icon} label={item.label} to={item.to} active={activeItem === item.label} />
      ))}

      <div className="dash-sidebar__logout-wrap">
        <a href="#" onClick={e => e.preventDefault()} className="dash-sidebar__logout">
          <Icon name="logout" size={17} color="rgba(255,255,255,0.5)" />
          Logout
        </a>
      </div>

    </aside>
  );
}
