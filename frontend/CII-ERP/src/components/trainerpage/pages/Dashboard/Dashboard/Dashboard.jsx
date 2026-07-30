import React, { useState } from 'react';
import WorkspaceHeader from '../WorkspaceHeader/WorkspaceHeader';
import BatchOverview from '../BatchOverview/BatchOverview';
// import TaskAssigned from '../TaskAssigned/TaskAssigned';
// import AttendanceChart from '../AttendanceChart/AttendanceChart';
// import RecentUploads from '../RecentUploads/RecentUploads';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import './Dashboard.css';

/**
 * Dashboard
 *
 * Staff "Trainer Workspace" dashboard page. Mounts the shared Topbar +
 * Sidebar shell around its own content — all the real markup/logic for
 * the dashboard grid lives in the Dashboard-specific components in
 * ./components, and all the fake data lives in /data.
 */
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: 'Staff Admin' }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="dashboard">
              <WorkspaceHeader />

              <div className="dashboard__row">
                <BatchOverview />
                {/* <TaskAssigned /> */}
              </div>

              {/* <div className="dashboard__row dashboard__row--secondary">
                <AttendanceChart />
                <RecentUploads />
              </div>*/}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
