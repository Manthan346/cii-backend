import React from "react";
import WorkspaceHeader from "../WorkspaceHeader/WorkspaceHeader";
import BatchOverview from "../BatchOverview/BatchOverview";
import TaskAssigned from "../TaskAssigned/TaskAssigned";
import AttendanceChart from "../AttendanceChart/AttendanceChart";
import RecentUploads from "../RecentUploads/RecentUploads";
import "./Dashboard.css";

/**
 * Dashboard
 *
 * Staff "Trainer Workspace" dashboard page. Purely a layout composition
 * of the Dashboard-specific components in ./components — all the real
 * markup/logic lives in each of those, and all the fake data lives in
 * /data, so this file just arranges the grid.
 */
const Dashboard = () => {
  return (
    <div className="dashboard">
      <WorkspaceHeader />

      <div className="dashboard__row dashboard__row--primary">
        <BatchOverview />
        <TaskAssigned />
      </div>

      <div className="dashboard__row dashboard__row--secondary">
        <AttendanceChart />
        <RecentUploads />
      </div>
    </div>
  );
};

export default Dashboard;
