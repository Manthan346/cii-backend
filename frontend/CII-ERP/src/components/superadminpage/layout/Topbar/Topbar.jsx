import { Menu, Sun, Moon } from "lucide-react";
import ciiLogo from "../../../../assets/header_logo_1.png";
import "./Topbar.css";

const Topbar = ({ onMenuToggle, darkMode, onThemeToggle }) => {
  return (
    <header className="superadmin-topbar">
      <button
        type="button"
        className="superadmin-topbar__menu"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <div className="superadmin-topbar__brand">
        <img src={ciiLogo} alt="Confederation of Indian Industry" />
      </div>
      <button
        className="superadmin-topbar__theme"
        onClick={onThemeToggle}
        type="button"
        aria-pressed={darkMode}
      >
        {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        <span>Theme</span>
      </button>
    </header>
  );
};

export default Topbar;