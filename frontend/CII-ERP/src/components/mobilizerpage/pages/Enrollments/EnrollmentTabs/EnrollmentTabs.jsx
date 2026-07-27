import React from "react";
import "./EnrollmentTabs.css";

/**
 * EnrollmentTabs
 *
 * The pill-shaped "Pending Enrollments (3) / Completed Enrollment (4)"
 * toggle that switches which list <EnrollmentsTable> renders below.
 * Purely presentational + controlled: the parent <Enrollments> page
 * owns the active tab in state and passes it down, so this component
 * has no data of its own.
 *
 * Props:
 *  - activeTab: "pending" | "completed"
 *  - onChange: function(tabId) -> fired when a tab is clicked
 *  - pendingCount: number
 *  - completedCount: number
 */
const EnrollmentTabs = ({
  activeTab = "pending",
  onChange,
  pendingCount = 0,
  completedCount = 0,
}) => {
  const tabs = [
    { id: "pending", label: "Pending Enrollments", count: pendingCount },
    { id: "completed", label: "Completed Enrollment", count: completedCount },
  ];

  return (
    <div className="enrollment-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`enrollment-tabs__tab ${
            activeTab === tab.id ? "enrollment-tabs__tab--active" : ""
          }`}
          onClick={() => onChange && onChange(tab.id)}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
};

export default EnrollmentTabs;
