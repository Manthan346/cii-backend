import { useState } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import BatchList from "../BatchList/BatchList";
import CreateBatch from "../CreateBatch/CreateBatch";
import "../../../styles/variables.css";
import "./BatchManagement.css";

const BatchManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("list"); // "list" | "create"
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setRefreshKey((k) => k + 1);
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
                refreshKey={refreshKey}
              />
            ) : (
              <CreateBatch
                onBack={() => setView("list")}
                onCreated={handleCreated}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
