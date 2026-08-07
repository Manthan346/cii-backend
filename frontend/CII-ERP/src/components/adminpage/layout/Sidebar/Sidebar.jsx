import React from 'react';
import { NavLink } from 'react-router-dom';
import { sidebarMenu } from '../../data';
import './Sidebar.css';

/**
 * Sidebar (Admin)
 *
 * Standalone admin navigation menu. Renders `sidebarMenu` from
 * adminpage/data with `.map()` - no hardcoded menu items live here.
 * Same shape/pattern as trainerpage's Sidebar, just pointed at the
 * admin route tree and admin-specific menu groups.
 *
 * Active state is driven by react-router's <NavLink>, so it stays in
 * sync with the URL automatically. No parent-managed "activeId" needed.
 *
 * Props:
 *  - isCollapsed: boolean   -> renders icon-only sidebar (future collapse toggle).
 *                              Defaults to false; a parent can wire a button to flip this later.
 *  - isOpen: boolean        -> controls the mobile off-canvas drawer state.
 *  - onClose: function      -> called when the mobile overlay is tapped or an item is selected,
 *                              so a parent layout can close the drawer.
 *
 * Layout-agnostic: doesn't assume an AdminLayout wrapper exists, so it
 * can be dropped into any shell.
 */
const Sidebar = ({ isCollapsed = false, isOpen = false, onClose }) => {
  return (
    <>
      {/* Overlay only appears/interacts on mobile via CSS */}
      {isOpen && (
        <div
          className="admin-sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''} ${
          isCollapsed ? 'admin-sidebar--collapsed' : ''
        }`}
        aria-label="Admin navigation"
      >
        <nav className="admin-sidebar__nav">
          {sidebarMenu.map((group) => (
            <div className="admin-sidebar__section" key={group.title}>
              <p className="admin-sidebar__section-title">{group.title}</p>

              <ul className="admin-sidebar__list">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.route}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `admin-sidebar__item ${
                            isActive ? 'admin-sidebar__item--active' : ''
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={19}
                              strokeWidth={isActive ? 2.1 : 1.6}
                              className="admin-sidebar__icon"
                            />
                            <span className="admin-sidebar__label">
                              {item.title}
                            </span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
