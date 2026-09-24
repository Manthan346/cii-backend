import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ciiLogo from "../../../assets/header_logo_1.png";
import { logoutUser } from "../../../services/authService";
import "./Logout.css";

export default function Logout({ onLogout }) {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (onLogout) {
      onLogout();
      return;
    }

    try {
      await logoutUser();
    } catch {
      // Client session state is cleared even if the API request fails.
    } finally {
      navigate("/LoginPage", { replace: true });
    }
  };

  return (
    <div className="recruiter-logout">
      <div className="recruiter-logout__card">
        <img
          src={ciiLogo}
          alt="CII - Confederation of Indian Industry"
          className="recruiter-logout__logo"
        />

        <h1 className="recruiter-logout__title">Log out of CII Portal?</h1>
        <p className="recruiter-logout__subtitle">
          You'll need to sign in again to access the recruiter dashboard,
          applications and hiring tools.
        </p>

        <button
          type="button"
          className="recruiter-logout__button recruiter-logout__button--primary"
          onClick={handleConfirm}
        >
          <LogOut size={17} />
          Yes, log me out
        </button>

        <button
          type="button"
          className="recruiter-logout__button recruiter-logout__button--secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
