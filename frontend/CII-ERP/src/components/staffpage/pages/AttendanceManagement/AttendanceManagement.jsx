import React, { useState } from "react";
import { Calendar } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import "./AttendanceManagement.css";

/**
 * AttendanceManagement
 *
 * Staff page for managing attendance.
 * This is a placeholder component that can be expanded with real functionality.
 */
const AttendanceManagement = () => {
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
            <div className="attendance-management">
      <SectionCard title="Attendance Management" className="attendance-management__card">
        <div className="attendance-management__content">
          <Calendar size={48} className="attendance-management__icon" />
          <h2>Attendance Management</h2>
          <p>Track and manage candidate attendance across batches.</p>
          <p className="attendance-management__placeholder-note">
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

export default AttendanceManagement;