import React, { useState } from "react";
import { Boxes } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import "./TaskAssigned.css";

/**
 * Task Assigned
 *
 * Staff page for managing resources.
 * This is a placeholder component that can be expanded with real functionality.
 */
const TaskAssigned = () => {
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
            <div className="task-assigned">
      <SectionCard title="TaskAssigned" className="task-assigned__card">
        <div className="task-assigned__content">
          <Boxes size={48} className="task-assigned__icon" />
          <h2>Task Assigned</h2>
          <p>Manage your assigned tasks and monitor their progress.</p>
          <p className="task-assigned__placeholder-note">
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

export default TaskAssigned;