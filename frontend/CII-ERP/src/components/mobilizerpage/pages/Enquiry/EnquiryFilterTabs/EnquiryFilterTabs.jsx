import React from "react";
import { enquiryFilterTabs } from "../../../data";
import "./EnquiryFilterTabs.css";

/**
 * EnquiryFilterTabs
 *
 * Row of status pills ("All (1200)", "New Enquiries", "Pending
 * Verification", "Verifying", "Dropped out") that filter the table
 * below by status. Purely presentational + controlled: the parent
 * <Enquiry> page owns the active filter in state and passes it down,
 * matching the pattern used by the Enrollments page's EnrollmentTabs.
 *
 * Tab labels/ids come from `enquiryFilterTabs` (data/enquiryData.js);
 * the "All" tab's count is passed in separately as `totalCount` since
 * it reflects the live, unfiltered dataset size rather than a fixed
 * number in the data file.
 *
 * Props:
 *  - activeFilter: string   -> id of the selected tab (matches enquiryFilterTabs[].id)
 *  - onChange: function(id) -> fired when a tab is clicked
 *  - totalCount: number     -> count shown next to the "All" tab
 */
const EnquiryFilterTabs = ({ activeFilter = "all", onChange, totalCount = 0 }) => {
  return (
    <div className="enquiry-filter-tabs" role="tablist">
      {enquiryFilterTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeFilter === tab.id}
          className={`enquiry-filter-tabs__tab ${
            activeFilter === tab.id ? "enquiry-filter-tabs__tab--active" : ""
          }`}
          onClick={() => onChange && onChange(tab.id)}
        >
          {tab.label}
          {tab.id === "all" && ` (${totalCount})`}
        </button>
      ))}
    </div>
  );
};

export default EnquiryFilterTabs;
