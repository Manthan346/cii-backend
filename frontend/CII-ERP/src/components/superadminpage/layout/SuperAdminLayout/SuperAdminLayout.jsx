import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../Sidebar/Sidebar";
import { logoutUser } from "../../../../services/authService";
import "./SuperAdminLayout.css";

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // The shared helper clears client session state even if the API is unavailable.
    } finally {
      navigate("/LoginPage", { replace: true });
    }
  };

  return (
    <div className="superadmin-layout">
      <Topbar onMenuToggle={() => setIsSidebarOpen(true)} />
      <div className="superadmin-layout__body">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />
        <main className="superadmin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
