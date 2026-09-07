import { useState } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import AttendanceTracker from "../AttendanceTracker/AttendanceTracker";
import "../../../styles/variables.css";
import "./AttendanceManagement.css";

/**
 * AttendanceManagement
 *
 * Trainer "Attendance Management" page. Mounts the shared Topbar +
 * Sidebar shell (identical composition to every other trainer page,
 * e.g. BatchManagement/CandidateManagement) around the attendance-
 * specific content, which lives in ./AttendanceTracker so this file
 * stays a thin route-level shell.
 */
const AttendanceManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="trainer-dashboard">
      <Topbar
        user={{ name: "Trainer Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="trainer-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="trainer-dashboard__main">
          <main className="trainer-dashboard__body">
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
