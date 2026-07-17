import React, { useState } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import BatchList from "../BatchList/BatchList";
import CreateBatch from "../CreateBatch/CreateBatch";
import { batches as initialBatches } from "../../../data";
import "../../../styles/variables.css";
import "./BatchManagement.css";

/**
 * BatchManagement
 *
 * Staff "Batch Management" page. Mounts the shared Topbar + Sidebar
 * shell (identical composition to every other staff page) around two
 * swappable views:
 *  - BatchList   -> default screen: stats, filters, "All Batches" table
 *  - CreateBatch -> "Create new Batch" form, opened via the
 *                   "+ Create batch" button and closed via "back"
 *
 * Batch data is lifted here so a newly created batch can be prepended
 * to the list that BatchList renders.
 */
const BatchManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [view, setView] = useState("list"); // "list" | "create"
  const [batches, setBatches] = useState(initialBatches);

  const handleCreated = (newBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    setView("list");
  };

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
            {view === "list" ? (
              <BatchList batches={batches} onCreateBatch={() => setView("create")} />
            ) : (
              <CreateBatch onBack={() => setView("list")} onCreated={handleCreated} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
