import React, { useMemo, useState } from "react";
import EnquiryHeader from "../EnquiryHeader/EnquiryHeader";
import EnquiryInfoBanner from "../EnquiryInfoBanner/EnquiryInfoBanner";
import EnquiryStats from "../EnquiryStats/EnquiryStats";
import EnquirySearchBar from "../EnquirySearchBar/EnquirySearchBar";
import EnquiryFilterTabs from "../EnquiryFilterTabs/EnquiryFilterTabs";
import EnquiryTable from "../EnquiryTable/EnquiryTable";
import EnquiryPagination from "../EnquiryPagination/EnquiryPagination";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { enquiries, enquiryPaginationInfo } from "../../../data";
import "./Enquiry.css";

/**
 * Enquiry
 *
 * Mobilizer "Enquiries" page. Mounts the same shared Topbar + Sidebar
 * shell as every other Mobilizer page (see Dashboard.jsx for the note
 * on why that block is duplicated per-page instead of centralized).
 * Everything below it is page-specific: EnquiryHeader (title +
 * subtitle + "Add new Candidate"), EnquiryInfoBanner (the blue helper
 * strip), EnquiryStats (the 4 KPI tiles), EnquirySearchBar (search +
 * course/date filters + export), EnquiryFilterTabs (status pills) and
 * EnquiryTable + EnquiryPagination for the candidate list itself. All
 * mock data lives in /data/enquiryData.js.
 *
 * Search text and the active status filter are owned here so they can
 * be combined to filter the same `enquiries` list; a real backend
 * would likely replace this client-side filter with a query param
 * sent to the API instead.
 */
const Enquiry = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredRows = useMemo(() => {
    return enquiries.filter((row) => {
      const matchesFilter =
        activeFilter === "all" || row.status.toLowerCase() === activeFilter;

      const matchesSearch =
        !searchQuery ||
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const handleViewCandidate = (row) => {
    // Backend integration note: navigate to the candidate detail /
    // verification flow, e.g. navigate(`/mobilizer/enquiries/${row.id}`)
    console.log("View candidate", row.id);
  };

  const handleExport = () => {
    // Backend integration note: trigger a GET to an export endpoint
    // (e.g. /api/mobilizer/enquiries/export.csv) or generate a CSV
    // client-side from the currently filtered rows.
    console.log("Export CSV clicked");
  };

  return (
    <div className="mobilizer-enquiry">
      <Topbar
        user={{ name: "Sonal Ahire", role: "Mobilizer · Kandivali Centre" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="mobilizer-enquiry__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="mobilizer-enquiry__main">
          <main className="mobilizer-enquiry__body">
            <div className="enquiry-page">
              <EnquiryHeader />
              <EnquiryInfoBanner />
              <EnquiryStats />
              <EnquirySearchBar
                onSearch={setSearchQuery}
                onExport={handleExport}
              />
              <EnquiryFilterTabs
                activeFilter={activeFilter}
                onChange={setActiveFilter}
                totalCount={enquiryPaginationInfo.total}
              />
              <EnquiryTable
                rows={filteredRows}
                onViewCandidate={handleViewCandidate}
              />
              <EnquiryPagination
                rangeStart={enquiryPaginationInfo.rangeStart}
                rangeEnd={enquiryPaginationInfo.rangeEnd}
                total={enquiryPaginationInfo.total}
                currentPage={enquiryPaginationInfo.currentPage}
                lastPage={enquiryPaginationInfo.lastPage}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
