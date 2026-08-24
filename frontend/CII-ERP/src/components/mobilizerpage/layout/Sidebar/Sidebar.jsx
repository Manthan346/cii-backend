import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { sidebarMenu } from '../../data';
import './Sidebar.css';

/**
 * Sidebar (Mobilizer)
 *
 * Standalone mobilizer navigation menu. Renders `sidebarMenu` from
 * mobilizerpage/data with `.map()` - no hardcoded menu items live
 * here. Flat list (no section groups, unlike adminpage's Sidebar),
 * with dividers, one expandable item ("Placement"), and one action
 * item ("Logout") mixed in - see data/sidebarMenu.js for the shapes.
 *
 * The Placement submenu auto-expands on mount if the current route is
 * already one of its children (e.g. landing directly on
 * /mobilizer/placement/events), so the active item is never hidden
 * behind a collapsed parent.
 *
 * Props:
 *  - isOpen: boolean     -> controls the mobile off-canvas drawer state.
 *  - onClose: function   -> called when the mobile overlay is tapped or an
 *                           item is selected, so a parent layout can close the drawer.
 *  - onLogout: function  -> called when the Logout item is clicked. The actual
 *                           session-clearing/redirect logic lives wherever this
 *                           is wired from (see MobilizerLayout.jsx).
 *
 * Layout-agnostic: doesn't assume a MobilizerLayout wrapper exists, so
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
          className="mobilizer-sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`mobilizer-sidebar ${isOpen ? 'mobilizer-sidebar--open' : ''}`}
        aria-label="Mobilizer navigation"
      >
        <nav className="mobilizer-sidebar__nav">
          <ul className="mobilizer-sidebar__list">
            {sidebarMenu.map((item) => {
              if (item.isDivider) {
                return <li key={item.id} className="mobilizer-sidebar__divider" role="separator" />;
              }

              if (item.isAction) {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="mobilizer-sidebar__item mobilizer-sidebar__item--action"
                      onClick={() => {
                        onClose?.();
                        onLogout?.();
                      }}
                    >
                      <Icon size={19} strokeWidth={1.6} className="mobilizer-sidebar__icon" />
                      <span className="mobilizer-sidebar__label">{item.title}</span>
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
                      className={`mobilizer-sidebar__item mobilizer-sidebar__item--parent ${
                        parentActive ? 'mobilizer-sidebar__item--active' : ''
                      }`}
                      aria-expanded={expanded}
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <Icon size={19} strokeWidth={parentActive ? 2.1 : 1.6} className="mobilizer-sidebar__icon" />
                      <span className="mobilizer-sidebar__label">{item.title}</span>
                      <ChevronDown
                        size={16}
                        strokeWidth={2.2}
                        className={`mobilizer-sidebar__chevron ${
                          expanded ? 'mobilizer-sidebar__chevron--open' : ''
                        }`}
                      />
                    </button>

                    {expanded && (
                      <ul className="mobilizer-sidebar__submenu">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <NavLink
                              to={child.route}
                              onClick={onClose}
                              className={({ isActive }) =>
                                `mobilizer-sidebar__subitem ${
                                  isActive ? 'mobilizer-sidebar__subitem--active' : ''
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
                      `mobilizer-sidebar__item ${
                        isActive ? 'mobilizer-sidebar__item--active' : ''
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={19}
                          strokeWidth={isActive ? 2.1 : 1.6}
                          className="mobilizer-sidebar__icon"
                        />
                        <span className="mobilizer-sidebar__label">{item.title}</span>
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
