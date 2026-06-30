// LogoDisplay.jsx
// Read-only logo renderer. src is supplied by the backend API.
// No upload affordance is exposed to the end user.
//
// Backend hookup:
//   <LogoDisplay src={course.logoUrl} alt={course.company} />
//   <SidebarLogo src={orgData.logoUrl} />

import Icon from '../Icon/Icon';
import './LogoDisplay.css';

/* ── Course-card logo ── */
export function LogoDisplay({ src, alt = 'Company logo', size, width, height }) {
  const w = width ?? size ?? '100%';
  const h = height ?? size ?? '100%';
  return (
    <div
      className="logo-display"
      style={{ width: w, height: h }}
    >
      {src && (
        <img
          className="logo-display__img"
          src={src}
          alt={alt}
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      )}
      <div
        className="logo-display__placeholder"
        style={{ display: src ? 'none' : 'flex' }}
      >
        <Icon name="image" size={28} color="var(--border)" />
        <span>Logo pending</span>
      </div>
    </div>
  );
}

/* ── Sidebar organisation logo ── */
export function SidebarLogo({ src }) {
  return (
    <div className="sidebar-logo">
      {src && (
        <img
          className="sidebar-logo__img"
          src={src}
          alt="Organisation logo"
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      )}
      <div
        className="sidebar-logo__placeholder"
        style={{ display: src ? 'none' : 'flex' }}
      >
        <Icon name="image" size={26} color="var(--blue-light)" />
        <span>Logo</span>
      </div>
    </div>
  );
}
