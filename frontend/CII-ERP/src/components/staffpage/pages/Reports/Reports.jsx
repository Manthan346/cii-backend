import React, { useState } from "react";
import { BarChart3 } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import "./Reports.css";

/**
 * Reports
 *
 * Staff page for viewing reports.
 * This is a placeholder component that can be expanded with real functionality.
 */
const Reports = () => {
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
            <div className="reports">
      <SectionCard title="Reports" className="reports__card">
        <div className="reports__content">
          <BarChart3 size={48} className="reports__icon" />
          <h2>Reports</h2>
          <p>View and generate reports for your training programs.</p>
          <p className="reports__placeholder-note">
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

export default Reports;