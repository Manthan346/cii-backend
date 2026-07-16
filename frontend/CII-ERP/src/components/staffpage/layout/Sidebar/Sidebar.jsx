import React from "react";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../../data";
import "./Sidebar.css";

/**
 * Sidebar
 *
 * Standalone staff navigation menu. Renders `sidebarMenu` from
 * staffpage/data with `.map()` — no hardcoded menu items live here.
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
 * This component is intentionally layout-agnostic: it doesn't assume
 * a StaffLayout wrapper exists, so it can be dropped into any shell.
 */
const Sidebar = ({ isCollapsed = false, isOpen = false, onClose }) => {
  return (
    <>
      {/* Overlay only appears/interacts on mobile via CSS */}
      {isOpen && (
        <div
          className="staff-sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`staff-sidebar ${isOpen ? "staff-sidebar--open" : ""} ${
          isCollapsed ? "staff-sidebar--collapsed" : ""
        }`}
        aria-label="Staff navigation"
      >
        <nav className="staff-sidebar__nav">
          {sidebarMenu.map((group) => (
            <div className="staff-sidebar__section" key={group.title}>
              <p className="staff-sidebar__section-title">{group.title}</p>

              <ul className="staff-sidebar__list">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.route}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `staff-sidebar__item ${
                            isActive ? "staff-sidebar__item--active" : ""
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={19}
                              strokeWidth={isActive ? 2.1 : 1.6}
                              className="staff-sidebar__icon"
                            />
                            <span className="staff-sidebar__label">
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
