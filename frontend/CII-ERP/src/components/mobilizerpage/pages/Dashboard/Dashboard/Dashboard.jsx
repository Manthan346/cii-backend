import React, { useState } from "react";
import OverviewHeader from "../OverviewHeader/OverviewHeader";
import DailyEnrollments from "../DailyEnrollments/DailyEnrollments";
import CandidateStatusDistribution from "../CandidateStatusDistribution/CandidateStatusDistribution";
import WeeklyCalls from "../WeeklyCalls/WeeklyCalls";
import UpcomingJobFairs from "../UpcomingJobFairs/UpcomingJobFairs";
import TodaysFollowups from "../TodaysFollowups/TodaysFollowups";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import "./Dashboard.css";

/**
 * Dashboard
 *
 * Mobilizer "Overview" dashboard page. Mounts the shared Topbar +
 * Sidebar shell around its own content — all the real markup/logic for
 * the dashboard grid lives in the Dashboard-specific components in
 * ../ (OverviewHeader, DailyEnrollments, CandidateStatusDistribution,
 * WeeklyCalls, UpcomingJobFairs, TodaysFollowups), and all the fake
 * data lives in /data.
 *
 * This same Topbar + Sidebar pairing should be mounted the same way at
 * the top of every other Mobilizer page (Enquiries, Enrollments, the
 * Job Fair sub-pages, Event...), so the shell stays identical across
 * the whole panel and only the content below it changes.
 */
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="mobilizer-dashboard">
      <Topbar
        user={{ name: "Sonal Ahire", role: "Mobilizer · Kandivali Centre" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="mobilizer-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="mobilizer-dashboard__main">
          <main className="mobilizer-dashboard__body">
            <div className="dashboard">
              <OverviewHeader />

              <div className="dashboard__row dashboard__row--primary">
                <DailyEnrollments />
                <CandidateStatusDistribution />
              </div>

              <div className="dashboard__row dashboard__row--secondary">
                <WeeklyCalls />
                <UpcomingJobFairs />
              </div>

              <div className="dashboard__row dashboard__row--full">
                <TodaysFollowups />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
