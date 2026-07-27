import React, { useState } from "react";
import EnrollmentsHeader from "../EnrollmentsHeader/EnrollmentsHeader";
import EnrollmentInfoBanner from "../EnrollmentInfoBanner/EnrollmentInfoBanner";
import EnrollmentTabs from "../EnrollmentTabs/EnrollmentTabs";
import EnrollmentsTable from "../EnrollmentsTable/EnrollmentsTable";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { pendingEnrollments, completedEnrollments } from "../../../data";
import "./Enrollments.css";

/**
 * Enrollments
 *
 * Mobilizer "Enrollments" page. Mounts the same shared Topbar + Sidebar
 * shell as every other Mobilizer page — see Dashboard.jsx for the note
 * on why that block is duplicated per-page instead of centralized —
 * and everything below it is page-specific: EnrollmentsHeader (eyebrow
 * + title + subtitle), EnrollmentInfoBanner (the green helper strip),
 * EnrollmentTabs (Pending vs Completed toggle) and EnrollmentsTable
 * (the actual candidate rows). All mock data lives in
 * /data/enrollmentsData.js.
 *
 * Tab state is owned here (not inside EnrollmentTabs) so this page can
 * later swap in real fetches per tab (e.g. re-query on tab change)
 * without needing to lift state up from a child.
 */
const Enrollments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const rows = activeTab === "pending" ? pendingEnrollments : completedEnrollments;

  const handleAction = (row) => {
    // Backend integration note: navigate to the enrollment form/detail
    // flow for this candidate, e.g. navigate(`/mobilizer/enrollments/${row.id}`)
    console.log("Enrollment action clicked for", row.id);
  };

  return (
    <div className="mobilizer-enrollments">
      <Topbar
        user={{ name: "Sonal Ahire", role: "Mobilizer · Kandivali Centre" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="mobilizer-enrollments__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="mobilizer-enrollments__main">
          <main className="mobilizer-enrollments__body">
            <div className="enrollments-page">
              <EnrollmentsHeader />
              <EnrollmentInfoBanner />

              <EnrollmentTabs
                activeTab={activeTab}
                onChange={setActiveTab}
                pendingCount={pendingEnrollments.length}
                completedCount={completedEnrollments.length}
              />

              <EnrollmentsTable rows={rows} onAction={handleAction} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Enrollments;
