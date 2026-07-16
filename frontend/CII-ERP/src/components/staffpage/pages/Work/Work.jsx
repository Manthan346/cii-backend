import React, { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import "./Work.css";

/**
 * Work
 *
 * Staff page for work management.
 * This is a placeholder component that can be expanded with real functionality.
 */
const Work = () => {
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
            <div className="work">
      <SectionCard title="Work" className="work__card">
        <div className="work__content">
          <BriefcaseBusiness size={48} className="work__icon" />
          <h2>Work</h2>
          <p>Manage your assigned work and tasks.</p>
          <p className="work__placeholder-note">
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

export default Work;