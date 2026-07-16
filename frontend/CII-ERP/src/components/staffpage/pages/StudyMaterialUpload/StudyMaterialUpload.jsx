import React, { useState } from "react";
import { Upload } from "lucide-react";
import SectionCard from "../../shared/SectionCard/SectionCard";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import "./StudyMaterialUpload.css";

/**
 * StudyMaterialUpload
 *
 * Staff page for uploading study materials.
 * This is a placeholder component that can be expanded with real functionality.
 */
const StudyMaterialUpload = () => {
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
            <div className="study-material-upload">
      <SectionCard title="Study Material Upload" className="study-material-upload__card">
        <div className="study-material-upload__content">
          <Upload size={48} className="study-material-upload__icon" />
          <h2>Study Material Upload</h2>
          <p>Upload and manage study materials for your batches.</p>
          <p className="study-material-upload__placeholder-note">
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

export default StudyMaterialUpload;