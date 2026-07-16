import React, { useState } from "react";
import { Layers } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import "./BatchManagement.css";

/**
 * BatchManagement
 *
 * Staff page for managing batches.
 * This is a placeholder component that can be expanded with real functionality.
 */
const BatchManagement = () => {
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
            <div className="batch-management">
      <SectionCard title="Batch Management" className="batch-management__card">
        <div className="batch-management__content">
          <Layers size={48} className="batch-management__icon" />
          <h2>Batch Management</h2>
          <p>View and manage all training batches.</p>
          <p className="batch-management__placeholder-note">
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

export default BatchManagement;