import React from "react";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../../data";
import "./Sidebar.css";

/**
 * Sidebar
 *
 * Standalone trainer navigation menu. Renders `sidebarMenu` from
 * trainerpage/data with `.map()` — no hardcoded menu items live here.
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
 * a TrainerLayout wrapper exists, so it can be dropped into any shell.
 */
const Sidebar = ({ isCollapsed = false, isOpen = false, onClose }) => {
  return (
    <>
      {/* Overlay only appears/interacts on mobile via CSS */}
      {isOpen && (
        <div
          className="trainer-sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`trainer-sidebar ${isOpen ? "trainer-sidebar--open" : ""} ${
          isCollapsed ? "trainer-sidebar--collapsed" : ""
        }`}
        aria-label="Trainer navigation"
      >
        <nav className="trainer-sidebar__nav">
          {sidebarMenu.map((group) => (
            <div className="trainer-sidebar__section" key={group.title}>
              <p className="trainer-sidebar__section-title">{group.title}</p>

              <ul className="trainer-sidebar__list">
                {group.items
                  .filter((item) => item.route)
                  .map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.id}>
                        <NavLink
                          to={item.route}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `trainer-sidebar__item ${
                              isActive ? "trainer-sidebar__item--active" : ""
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon
                                size={19}
                                strokeWidth={isActive ? 2.1 : 1.6}
                                className="trainer-sidebar__icon"
                              />
                              <span className="trainer-sidebar__label">
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
