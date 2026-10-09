import { useState } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import BatchList from "../BatchList/BatchList";
import CreateBatch from "../CreateBatch/CreateBatch";
import "../../../styles/variables.css";
import "./BatchManagement.css";

const BatchManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [batchToEdit, setBatchToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
    setBatchToEdit(null);
    setView("list");
  };

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
            {view === "list" ? (
              <BatchList
                onCreateBatch={() => setView("create")}
                onEditBatch={(batch) => {
                  setBatchToEdit(batch);
                  setView("edit");
                }}
                refreshKey={refreshKey}
              />
            ) : view === "create" ? (
              <CreateBatch
                onBack={() => setView("list")}
                onCreated={handleSaved}
              />
            ) : (
              <CreateBatch
                batch={batchToEdit}
                onBack={() => {
                  setBatchToEdit(null);
                  setView("list");
                }}
                onCreated={handleSaved}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
