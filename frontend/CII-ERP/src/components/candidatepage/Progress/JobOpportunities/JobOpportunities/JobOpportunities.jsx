// ============================================================================
// JobOpportunities.jsx
// ----------------------------------------------------------------------------
// Main "Job Opportunities" page (Progress > Job Opportunities in the sidebar).
// Same page-shell pattern as Assessments / Certificates:
//
//   <Sidebar />  <Topbar />
//                <page content>
//
// Composition (each imported from its own component folder):
//   - JobStats/         -> top row of solid-blue stat cards
//   - JobFiltersBar/     -> "Filters | Location | Type | Roles | Sort by" row
//   - JobList/           -> horizontally-scrolling row of JobCard
//     - JobCard/
//       - HiringBanner/
//
// Mock data lives in src/components/candidatepage/data/jobOpportunitiesData.js
// (see that file for the suggested REST endpoints).
//
// PROP NOTES (matched to Sidebar.jsx / Topbar.jsx):
//   <Sidebar isOpen={sidebarOpen} onClose={...} activeItem="Job Opportunities" />
//     - activeItem is compared against each NAV item's `label`
//       (`active={activeItem === item.label}`), and Sidebar.jsx's
//       NAV_PROGRESS entry is `{ label: 'Job Opportunities', to: null }` —
//       so this must be the exact string "Job Opportunities".
//     - IMPORTANT: that nav entry currently has `to: null`, which makes
//       NavItem render a plain <button> instead of a <Link> (see
//       Sidebar.jsx's NavItem: `if (to) return <Link .../>`). Update
//       NAV_PROGRESS in Sidebar.jsx to
//       `{ icon: 'jobs', label: 'Job Opportunities', to: '/progress/job-opportunities' }`
//       so clicking it actually navigates here.
//   <Topbar onMenuClick={...} search={search} onSearch={setSearch} userInitials="AS" />
//
// LAYOUT NOTE (sidebar overlap):
//   Sidebar.css positions <aside class="sidebar"> with `position: fixed;
//   width: 240px;`, which takes it out of normal document flow. See
//   JobOpportunities.css — the main content column uses
//   `margin-left: 240px` (collapsing to 0 under the 900px breakpoint,
//   matching Sidebar.css's own off-canvas breakpoint) instead of relying
//   on flex/grid to make room for it.
//
// BACKEND INTEGRATION:
// Replace the local useState(mockData) calls with real fetches — see the
// comment block at the top of jobOpportunitiesData.js for endpoint shapes.
// ============================================================================

import { useState } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import JobStats from "../JobStats/JobStats";
import JobFiltersBar from "../JobFiltersBar/JobFiltersBar";
import JobList from "../JobList/JobList";
import {
  jobOpportunityStats,
  jobFilterOptions,
  jobOpportunities,
} from "../../../../../data/jobOpportunitiesData";

import "./JobOpportunities.css";

import orgLogo from "../../../../../assets/Logo.png"

const JobOpportunities = () => {
  // Local UI state. Swap `stats`/`jobs` for real fetched state (see
  // BACKEND INTEGRATION comment above) once the backend endpoints are ready.
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats] = useState(jobOpportunityStats);
  const [jobs, setJobs] = useState(jobOpportunities);

  // BACKEND NOTE: wire this to POST /api/job-opportunities/:jobId/apply
  const handleApply = (job) => {
    console.log("Apply to job:", job.id);
  };

  // Optimistic local toggle for the bookmark button.
  // BACKEND NOTE: wire this to POST /api/job-opportunities/:jobId/save
  // and reconcile with the server response (or roll back on failure).
  const handleToggleSave = (job) => {
    setJobs((prev) =>
      prev.map((item) =>
        item.id === job.id ? { ...item, isSaved: !item.isSaved } : item
      )
    );
  };

  // BACKEND / STATE NOTE: hook these up to real dropdown menus + filter
  // state once designs for the open/expanded states are available.
  const handleOpenFilters = () => {
    console.log("Open filters panel");
  };
  const handleOpenDropdown = (filterId) => {
    console.log("Open dropdown:", filterId);
  };

  return (
    <div className="job-opportunities-page">
      <Sidebar
        orgLogoSrc={orgLogo}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Job Opportunities"
      />
      {/* Mobile drawer scrim — see Sidebar.jsx's own usage comment.
          Only visible under the 900px breakpoint where Sidebar.css turns
          the sidebar into an off-canvas drawer. */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="job-opportunities-page__main">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          search={search}
          onSearch={setSearch}
          userInitials="AS"
        />

        <div className="job-opportunities-page__content">
          <header className="job-opportunities-page__header">
            <h1 className="job-opportunities-page__title">Job opportunities</h1>
            <p className="job-opportunities-page__subtitle">
              Roles match to your skill and Course program
            </p>
          </header>

          <JobStats stats={stats} />

          <JobFiltersBar
            hasActiveIndicator={jobFilterOptions.hasActiveIndicator}
            filters={jobFilterOptions.filters}
            sort={jobFilterOptions.sort}
            onOpenFilters={handleOpenFilters}
            onOpenDropdown={handleOpenDropdown}
          />

          <JobList jobs={jobs} onApply={handleApply} onToggleSave={handleToggleSave} />
        </div>
      </div>
    </div>
  );
};

export default JobOpportunities;
