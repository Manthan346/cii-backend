import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { sidebarMenu } from "../../data/sidebarMenu";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, onLogout }) => (
  <>
    {isOpen && (
      <div
        className="superadmin-sidebar__overlay"
        onClick={onClose}
        aria-hidden="true"
      />
    )}
    <aside
      className={`superadmin-sidebar${isOpen ? " superadmin-sidebar--open" : ""}`}
      aria-label="Super-admin navigation"
    >
      <nav className="superadmin-sidebar__nav">
        {sidebarMenu.map((group) => (
          <section className="superadmin-sidebar__section" key={group.title}>
            <p className="superadmin-sidebar__section-title">{group.title}</p>
            <ul className="superadmin-sidebar__list">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.route}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `superadmin-sidebar__item${isActive ? " superadmin-sidebar__item--active" : ""}`
                      }
                    >
                      <Icon size={17} />
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
      <button
        className="superadmin-sidebar__logout"
        type="button"
        onClick={() => {
          onClose?.();
          onLogout?.();
        }}
      >
        <LogOut size={17} />
        <span>Log out</span>
      </button>
    </aside>
  </>
);

export default Sidebar;
