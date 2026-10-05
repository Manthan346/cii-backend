import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../Sidebar/Sidebar";
import "./SuperAdminLayout.css";

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="superadmin-layout">
      <Topbar onMenuToggle={() => setIsSidebarOpen(true)} />
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