import React, { useState } from "react";
import { Boxes } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import "./Notifications.css";

/**
 * Notification 
 *
 * Staff page for managing resources.
 * This is a placeholder component that can be expanded with real functionality.
 */
const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="notifications">
      <SectionCard title="Notifications" className="notifications__card">
        <div className="notifications__content">
          <Boxes size={48} className="notifications__icon" />
          <h2>Notifications</h2>
          <p>Access and manage your notifications.</p>
          <p className="notifications__placeholder-note">
            This page is under development. Content will be added soon.
          </p>
        </div>
      </SectionCard>
    </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Notifications;