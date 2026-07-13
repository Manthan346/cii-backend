// ============================================================================
// certificatesData.js
// ----------------------------------------------------------------------------
// Mock data for the Certificates page. Two tabs — "Courses" and "Workshops"
// — each have their own stat row and their own certificate list, matching
// the two screenshots (note the Workshops tab shows 3 stat cards, one
// fewer than Courses — "Shared to Profile" is only shown for Courses in
// the design, so that's preserved here).
//
// BACKEND INTEGRATION NOTES:
// Replace these static exports with API calls, e.g. inside Certificates.jsx:
//
//   useEffect(() => {
//     fetch(`/api/candidates/${candidateId}/certificates?type=${activeTab}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStats(data.stats);
//         setCertificates(data.certificates);
//       });
//   }, [candidateId, activeTab]);
//
// Suggested REST endpoints:
//   GET /api/candidates/:id/certificates/stats?type=courses|workshops
//   GET /api/candidates/:id/certificates?type=courses|workshops
//   GET /api/certificates/:certificateId/download   (returns a file/blob)
//   POST /api/certificates/:certificateId/share      (shares to profile)
// ============================================================================

// Stat cards shown above the tab switcher, keyed by active tab.
export const certificateStatsByTab = {
  courses: [
    { id: "earned", icon: "certificate", value: "4", label: "Certificate earned" },
    { id: "inProgress", icon: "hourGlass", value: "2", label: "In progress" },
    { id: "avgGrade", icon: "trendingUp", value: "1", label: "Average Grade" },
  ],
  workshops: [
    { id: "earned", icon: "certificate", value: "4", label: "Certificate earned" },
    { id: "inProgress", icon: "hourGlass", value: "2", label: "In progress" },
    { id: "avgGrade", icon: "trendingUp", value: "1", label: "Average Grade" },
  ],
};

// Certificate cards shown below the tab switcher, keyed by active tab.
// `subtitle` is pre-formatted to match each tab's slightly different layout
// (Courses shows "Issued <date> <issuer>", Workshops shows
// "<date> (<duration>) <issuer>" with no "Issued" prefix).
export const certificatesByTab = {
  courses: [
    {
      id: "business-communication",
      title: "Business Comunication",
      subtitle: "Issued  3 june 2026 .P Das",
      grade: "A Grade",
    },
    {
      id: "intro-spreadsheets",
      title: "Intro to Spreadsheets",
      subtitle: "Issued  14 April 2026 .P Das",
      grade: "A Grade",
    },
  ],
  workshops: [
    {
      id: "nail-art-workshop",
      title: "Nail art workshop",
      subtitle: "13 june 2026 (2days)  .P Das",
      grade: "A Grade",
    },
    {
      id: "cake-making",
      title: "Cake making",
      subtitle: "14 April 2026 (5days).P Das",
      grade: "A Grade",
    },
  ],
};
