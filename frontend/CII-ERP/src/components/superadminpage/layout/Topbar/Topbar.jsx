import { Menu } from "lucide-react";
import ciiLogo from "../../../../assets/header_logo_1.png";
import "./Topbar.css";

const Topbar = ({ onMenuToggle }) => {
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
    </header>
  );
};

export default Topbar;