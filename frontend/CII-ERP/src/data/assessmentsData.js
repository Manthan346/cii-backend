// ============================================================================
// assessmentsData.js
// ----------------------------------------------------------------------------
// Mock data for the Assessments page.
//
// BACKEND INTEGRATION NOTES:
// Replace these static exports with API calls, e.g. inside Assessments.jsx:
//
//   useEffect(() => {
//     fetch(`/api/candidates/${candidateId}/assessments`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStats(data.stats);
//         setPending(data.pending);
//         setCompleted(data.completed);
//         setCoursePerformance(data.coursePerformance);
//       });
//   }, [candidateId]);
//
// Suggested REST endpoints:
//   GET /api/candidates/:id/assessments/stats
//   GET /api/candidates/:id/assessments/pending
//   GET /api/candidates/:id/assessments/completed
//   GET /api/candidates/:id/performance-by-course
// ============================================================================

// Top summary stat cards (Pending / Completed / Average score / Best score)
export const assessmentStats = [
  {
    id: "pending",
    icon: "hourGlass",
    iconBg: "#FDECE3",
    iconColor: "#E8834A",
    value: "2",
    label: "Pending",
  },
  {
    id: "completed",
    icon: "checkCircle",
    iconBg: "#E1F5EA",
    iconColor: "#2FAE60",
    value: "4",
    label: "Completed",
  },
  {
    id: "average",
    icon: "trendingUp",
    iconBg: "#E8E9FB",
    iconColor: "#5B5FEF",
    value: "84%",
    label: "Average score",
  },
  {
    id: "best",
    icon: "trophy",
    iconBg: "#FBE9E4",
    iconColor: "#E8834A",
    value: "96%",
    label: "Best score",
  },
];

// Assessments that are still pending / not yet submitted
export const pendingAssessments = [
  {
    id: "sql-basics-quiz",
    title: "SQL Basics Quiz",
    course: "Python for Data Analysis",
    type: "quiz", // 'quiz' | 'assignment'
    dueLabel: "Due in 2 days",
    questions: 15,
    duration: "20 min",
    ctaLabel: "Start Now",
  },
  {
    id: "clustering-assignment",
    title: "Clustering Assignment",
    icon: "dashboard",
    course: "Data Science Fundamentals",
    type: "assignment",
    dueLabel: "Due in 2 days",
    questions: 15,
    duration: "20 min",
    ctaLabel: "Start Now",
  },
];

// Assessments that have already been submitted / graded
export const completedAssessments = [
  {
    id: "data-visualization",
    title: "Data Visualization",
    course: "Data Science",
    score: 92,
    submittedOn: "Submitted 18 Jun",
  },
  {
    id: "business-writing-final",
    title: "Business Writing Final",
    course: "Business Communication",
    score: 96,
    submittedOn: "Submitted 30 May",
  },
  {
    id: "pandas-fundamentals-quiz",
    title: "Pandas Fundamentals Quiz",
    course: "Python for Data Analysis",
    score: 74,
    submittedOn: "Submitted 22 May",
  },
];

// "Performance by course" progress bars (right column)
export const coursePerformance = [
  { id: "graphic-design", course: "Graphic Design", percentage: 90, color: "#4F7CF6" },
  { id: "housekeeping", course: "Housekeeping", percentage: 74, color: "#F2994A" },
  { id: "cyber-security", course: "Cyber Security", percentage: 96, color: "#2FAE60" },
];

// "Tips before you start" list (right column, bottom card)
export const assessmentTips = [
  {
    id: "timer",
    icon: "lightBulb",
    text: "Quizzes auto-submit when the timer ends, so keep an eye on the clock.",
  },
  {
    id: "connection",
    icon: "wifi",
    text: "Make sure you're on a stable connection before starting timed quizzes.",
  },
  {
    id: "drafts",
    icon: "rotateCcw",
    text: "Assignments can be saved as drafts and resumed before the due date.",
  },
];
