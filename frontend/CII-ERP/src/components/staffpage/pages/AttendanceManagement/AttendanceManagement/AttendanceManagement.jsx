import React, { useState } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import AttendanceTracker from "../AttendanceTracker/AttendanceTracker";
import "../../../styles/variables.css";
import "./AttendanceManagement.css";

/**
 * AttendanceManagement
 *
 * Staff "Attendance Management" page. Mounts the shared Topbar +
 * Sidebar shell (identical composition to every other staff page,
 * e.g. BatchManagement/CandidateManagement) around the attendance-
 * specific content, which lives in ./AttendanceTracker so this file
 * stays a thin route-level shell.
 */
const AttendanceManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
              <AttendanceTracker />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
