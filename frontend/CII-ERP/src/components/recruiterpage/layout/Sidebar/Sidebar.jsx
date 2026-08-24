import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { sidebarMenu } from '../../data';
import './Sidebar.css';

/**
 * Sidebar (Recruiter)
 *
 * Standalone recruiter navigation menu, same pattern as mobilizerpage's
 * Sidebar: renders `sidebarMenu` from recruiterpage/data with `.map()`,
 * no menu items hardcoded here. Adds one thing mobilizer's version
 * doesn't need - `isHeading` items - to render the "MAIN" / "HIRING"
 * section labels from the recruiter dashboard reference design.
 *
 * The Placement submenu pattern (expandable parent w/ children) is
 * kept intact even though the current recruiter menu doesn't use it,
 * so any future expandable item (e.g. Job Management sub-pages) can
 * be added purely in data/sidebarMenu.js without touching this file.
 *
 * Props:
 *  - isOpen: boolean     -> controls the mobile off-canvas drawer state.
 *  - onClose: function   -> called when the mobile overlay is tapped or an
 *                           item is selected, so a parent layout can close the drawer.
 *  - onLogout: function  -> called when the Logout item is clicked. The actual
 *                           session-clearing/redirect logic lives wherever this
 *                           is wired from (see RecruiterLayout.jsx).
 *
 * Layout-agnostic: doesn't assume a RecruiterLayout wrapper exists, so
 * it can be dropped into any shell.
 */
const Sidebar = ({ isOpen = false, onClose, onLogout }) => {
  const location = useLocation();

  const isChildActive = (item) =>
    item.children?.some((child) => location.pathname.startsWith(child.route));

  const [expandedId, setExpandedId] = useState(() => {
    const initiallyExpanded = sidebarMenu.find((item) => isChildActive(item));
    return initiallyExpanded?.id ?? null;
  });

  const toggleExpanded = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {isOpen && (
        <div
          className="recruiter-sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`recruiter-sidebar ${isOpen ? 'recruiter-sidebar--open' : ''}`}
        aria-label="Recruiter navigation"
      >
        <nav className="recruiter-sidebar__nav">
          <ul className="recruiter-sidebar__list">
            {sidebarMenu.map((item) => {
              if (item.isHeading) {
                return (
                  <li key={item.id} className="recruiter-sidebar__heading" role="presentation">
                    {item.title}
                  </li>
                );
              }

              if (item.isDivider) {
                return <li key={item.id} className="recruiter-sidebar__divider" role="separator" />;
              }

              if (item.isAction) {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="recruiter-sidebar__item recruiter-sidebar__item--action"
                      onClick={() => {
                        onClose?.();
                        onLogout?.();
                      }}
                    >
                      <Icon size={19} strokeWidth={1.6} className="recruiter-sidebar__icon" />
                      <span className="recruiter-sidebar__label">{item.title}</span>
                    </button>
                  </li>
                );
              }

              if (item.children) {
                const Icon = item.icon;
                const expanded = expandedId === item.id;
                const parentActive = expanded || isChildActive(item);

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`recruiter-sidebar__item recruiter-sidebar__item--parent ${
                        parentActive ? 'recruiter-sidebar__item--active' : ''
                      }`}
                      aria-expanded={expanded}
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <Icon size={19} strokeWidth={parentActive ? 2.1 : 1.6} className="recruiter-sidebar__icon" />
                      <span className="recruiter-sidebar__label">{item.title}</span>
                      <ChevronDown
                        size={16}
                        strokeWidth={2.2}
                        className={`recruiter-sidebar__chevron ${
                          expanded ? 'recruiter-sidebar__chevron--open' : ''
                        }`}
                      />
                    </button>

                    {expanded && (
                      <ul className="recruiter-sidebar__submenu">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <NavLink
                              to={child.route}
                              onClick={onClose}
                              className={({ isActive }) =>
                                `recruiter-sidebar__subitem ${
                                  isActive ? 'recruiter-sidebar__subitem--active' : ''
                                }`
                              }
                            >
                              {child.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.route}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `recruiter-sidebar__item ${
                        isActive ? 'recruiter-sidebar__item--active' : ''
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={19}
                          strokeWidth={isActive ? 2.1 : 1.6}
                          className="recruiter-sidebar__icon"
                        />
                        <span className="recruiter-sidebar__label">{item.title}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
