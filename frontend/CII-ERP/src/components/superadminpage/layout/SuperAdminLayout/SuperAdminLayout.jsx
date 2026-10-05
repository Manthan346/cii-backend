import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../Sidebar/Sidebar";
import "./SuperAdminLayout.css";

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`superadmin-layout${darkMode ? " superadmin-layout--dark" : ""}`}
    >
      <Topbar
        onMenuToggle={() => setIsSidebarOpen(true)}
        darkMode={darkMode}
        onThemeToggle={() => setDarkMode((current) => !current)}
      />
      <div className="superadmin-layout__body">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="superadmin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;