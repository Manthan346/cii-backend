import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { sidebarMenu } from "../../data";
import "./Sidebar.css";

/**
 * Sidebar
 *
 * Standalone Mobilizer navigation menu. Renders `sidebarMenu` from
 * mobilizerpage/data with `.map()` — no hardcoded menu items live here.
 *
 * Supports two item shapes from the data file:
 *  - a flat item (`route` present)            -> plain <NavLink>
 *  - an expandable group (`children` present)  -> accordion header that
 *                                                  toggles open/closed and
 *                                                  reveals a nested list of
 *                                                  <NavLink> items (e.g. "Job Fair")
 *
 * The expandable group auto-opens whenever the current route matches
 * one of its children, so a hard refresh/deep-link on e.g.
 * /mobilizer/job-fair/reports lands with "Job Fair" already expanded.
 *
 * Props:
 *  - isCollapsed: boolean   -> renders icon-only sidebar (future collapse toggle).
 *                              Defaults to false; a parent can wire a button to flip this later.
 *  - isOpen: boolean        -> controls the mobile off-canvas drawer state.
 *  - onClose: function      -> called when the mobile overlay is tapped or an item is selected,
 *                              so a parent layout can close the drawer.
 *
 * This component is intentionally layout-agnostic: it doesn't assume
 * a MobilizerLayout wrapper exists, so it can be dropped into any shell.
 */
const Sidebar = ({ isCollapsed = false, isOpen = false, onClose }) => {
  const location = useLocation();
  const [openGroupId, setOpenGroupId] = useState(null);

  // Auto-expand a group if the current URL is inside one of its children.
  useEffect(() => {
    const activeGroup = sidebarMenu.find(
      (item) =>
        item.children &&
        item.children.some((child) => location.pathname.startsWith(child.route))
    );
    if (activeGroup) setOpenGroupId(activeGroup.id);
  }, [location.pathname]);

  const toggleGroup = (id) => {
    setOpenGroupId((current) => (current === id ? null : id));
  };

  return (
    <>
      {/* Overlay only appears/interacts on mobile via CSS */}
      {isOpen && (
        <div
          className="mobilizer-sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`mobilizer-sidebar ${isOpen ? "mobilizer-sidebar--open" : ""} ${
          isCollapsed ? "mobilizer-sidebar--collapsed" : ""
        }`}
        aria-label="Mobilizer navigation"
      >
        <nav className="mobilizer-sidebar__nav">
          <ul className="mobilizer-sidebar__list">
            {sidebarMenu.map((item) => {
              const Icon = item.icon;

              /* ---- Expandable group (e.g. Job Fair) ---- */
              if (item.children) {
                const isGroupActive = item.children.some((child) =>
                  location.pathname.startsWith(child.route)
                );
                const isOpenGroup = openGroupId === item.id;

                return (
                  <li key={item.id} className="mobilizer-sidebar__group">
                    <button
                      type="button"
                      className={`mobilizer-sidebar__item mobilizer-sidebar__item--group ${
                        isGroupActive ? "mobilizer-sidebar__item--active" : ""
                      }`}
                      onClick={() => toggleGroup(item.id)}
                      aria-expanded={isOpenGroup}
                    >
                      <Icon
                        size={19}
                        strokeWidth={isGroupActive ? 2.1 : 1.6}
                        className="mobilizer-sidebar__icon"
                      />
                      <span className="mobilizer-sidebar__label">{item.title}</span>
                      <ChevronDown
                        size={16}
                        className={`mobilizer-sidebar__chevron ${
                          isOpenGroup ? "mobilizer-sidebar__chevron--open" : ""
                        }`}
                      />
                    </button>

                    <ul
                      className={`mobilizer-sidebar__submenu ${
                        isOpenGroup ? "mobilizer-sidebar__submenu--open" : ""
                      }`}
                    >
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <NavLink
                            to={child.route}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `mobilizer-sidebar__subitem ${
                                isActive ? "mobilizer-sidebar__subitem--active" : ""
                              }`
                            }
                          >
                            {child.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              /* ---- Flat item ---- */
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.route}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `mobilizer-sidebar__item ${
                        isActive ? "mobilizer-sidebar__item--active" : ""
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
