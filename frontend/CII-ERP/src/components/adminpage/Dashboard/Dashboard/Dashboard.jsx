import React from "react";
import StatsOverview from "../StatsOverview/StatsOverview";
import CoursePerformance from "../CoursePerformance/CoursePerformance";
import {
  summaryStats,
  coursePerformance,
} from "../../data";
import "./Dashboard.css";

/**
 * Dashboard (Admin)
 *
 * Top-level "Institution overview" landing page for the admin section.
 * Composes the section components that sit alongside it in /Dashboard
 * (StatsOverview, CandidateJourney, CoursePerformance,
 * ApprovalRequests) - this file owns layout and data wiring only, no
 * section renders its own markup here.
 *
 * All content currently comes from data/dashboardData.js mocks. Swap
 * those imports for real fetched state (react-query, a custom hook,
 * etc.) once the backend endpoints noted in dashboardData.js are
 * ready - the section components don't need to change, they just
 * take the same props.
 */
const Dashboard = () => {
  const handleApprove = (id) => {
    // TODO: PATCH /api/admin/approval-requests/:id { status: 'approved' }
    console.log("approve", id);
  };

  const handleReject = (id) => {
    // TODO: PATCH /api/admin/approval-requests/:id { status: 'rejected' }
    console.log("reject", id);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__heading">
        <h1 className="admin-dashboard__title">Institution overview</h1>
        <p className="admin-dashboard__subtitle">
          Snapshot across all centers · Updated 5 minutes ago
        </p>
      </div>

      <StatsOverview stats={summaryStats} />

      {/* <CandidateJourney steps={candidateJourney} /> */}

      <CoursePerformance courses={coursePerformance} />

    </div>
  );
};

export default Dashboard;
