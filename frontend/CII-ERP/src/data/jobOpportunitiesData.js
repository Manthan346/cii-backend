// ============================================================================
// jobOpportunitiesData.js
// ----------------------------------------------------------------------------
// Mock data for the Job Opportunities page (Progress > Job Opportunities).
//
// Per project convention, page-level mock data lives here in
// src/components/candidatepage/data/ (alongside assessmentsData.js) rather
// than inside the page's own component folder.
//
// BACKEND INTEGRATION NOTES:
// Replace these static exports with API calls, e.g. inside JobOpportunities.jsx:
//
//   useEffect(() => {
//     fetch(`/api/candidates/${candidateId}/job-opportunities/stats`)
//       .then((res) => res.json())
//       .then(setStats);
//
//     fetch(`/api/candidates/${candidateId}/job-opportunities?${queryParams}`)
//       .then((res) => res.json())
//       .then(setJobs);
//   }, [candidateId, filters]);
//
// Suggested REST endpoints:
//   GET  /api/candidates/:id/job-opportunities/stats
//   GET  /api/candidates/:id/job-opportunities?location=&type=&role=&sort=
//   POST /api/job-opportunities/:jobId/apply
//   POST /api/job-opportunities/:jobId/save     (bookmark / unsave toggle)
// ============================================================================

// Top summary stat cards.
export const jobOpportunityStats = [
  { id: "open", icon: "lightBulb", value: "12", label: "open opportunities" },
  { id: "applied", icon: "send", value: "5", label: "Application sent" },
];

// Filter bar options. `hasActiveIndicator` drives the small green dot shown
// on the "Filters" pill in the design when at least one filter is applied.
export const jobFilterOptions = {
  hasActiveIndicator: true,
  filters: [
    { id: "location", label: "Location" },
    { id: "type", label: "Type" },
    { id: "roles", label: "Roles" },
  ],
  sort: { id: "sortBy", label: "Sort by" },
};

// Job opportunity cards.
// `matchPercent` drives the green "NN % Match" text under the title.
// `isSaved` is the initial bookmark state (bookmarked jobs render the
// filled bookmark icon instead of the outline).
export const jobOpportunities = [
  {
    id: "junior-data-analyst",
    title: "Junior data analyst",
    matchPercent: 93,
    isSaved: false,
  },
  {
    id: "data-analyst",
    title: "Data analyst",
    matchPercent: 83,
    isSaved: false,
  },
  {
    id: "ui-ux-intern",
    title: "UI/UX intern",
    matchPercent: 90,
    isSaved: false,
  },
];
