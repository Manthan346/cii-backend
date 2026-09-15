import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button/Button";
import ciiLogo from "../assets/cii-logo2.png";
import "./Logout.css";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    navigate("/");
  };

  return (
    <div className="admin-logout">
      <div className="admin-logout__card">
        <img src={ciiLogo} alt="CII" className="admin-logout__logo" />

        <h1 className="admin-logout__title">Log out of CII Portal?</h1>
        <p className="admin-logout__subtitle">
          You'll need to sign in again to access the admin dashboard,
          candidate records and reports.
        </p>

        <Button variant="primary" icon={LogOut} onClick={handleConfirm}>
          Yes, log me out
        </Button>

        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Logout;
