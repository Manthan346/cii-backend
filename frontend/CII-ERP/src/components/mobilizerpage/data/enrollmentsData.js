/**
 * enrollmentsData.js
 *
 * Single source of truth for the Mobilizer Enrollments page (fake/mock
 * data). Every Enrollments component reads from here instead of
 * hardcoding values, so swapping this for a real API response later is
 * a drop-in change — no component needs to be touched, only this file
 * (or the fetch layer that eventually replaces it).
 *
 * Backend integration note:
 *   Replace each exported constant with data fetched from your API
 *   (e.g. GET /api/mobilizer/enrollments) and keep the same shape.
 */

/* -------------------------------------------------- */
/* Page header                                         */
/* -------------------------------------------------- */
export const enrollmentsInfo = {
  eyebrow: "ENROLLMENTS",
  title: "Enrollments",
  subtitle:
    "Candidates who have visited the office and are being converted into enrolled candidates.",
};

/* -------------------------------------------------- */
/* Info banner                                         */
/* -------------------------------------------------- */
export const enrollmentInfoBanner = {
  text: "Candidates land here once documents are collected. Submitting the enrollment form moves them into the",
  highlight: "Candidate database",
  suffix: "below.",
};

/* -------------------------------------------------- */
/* Documents status -> tone mapping                    */
/*   (used by EnrollmentsTable to color the pill and    */
/*   the helper caption underneath it)                  */
/* -------------------------------------------------- */
export const documentStatusMeta = {
  "follow-up required": { tone: "orange", caption: "Documents Pending" },
  interested: { tone: "green", caption: "Documents Collected" },
  "documents verified": { tone: "green", caption: "Documents Collected" },
};

/* -------------------------------------------------- */
/* Pending enrollments (tab 1)                         */
/* -------------------------------------------------- */
export const pendingEnrollments = [
  {
    id: "ENQ-1041",
    candidate: "Kiran Sawant",
    course: "Graphic Design",
    location: "Akurli road",
    documentStatus: "Follow-up Required",
    lastUpdated: "12 Jul",
    action: "Continue Enrollment",
  },
  {
    id: "ENQ-1039",
    candidate: "Rohit Shinde",
    course: "F&B Service & Production",
    location: "Malad East",
    documentStatus: "Interested",
    lastUpdated: "11 Jul",
    action: "Continue Enrollment",
  },
  {
    id: "ENQ-1041",
    candidate: "Pooja Jadhav",
    course: "Cyber Security",
    location: "Dahisar",
    documentStatus: "Follow-up Required",
    lastUpdated: "06 Jul",
    action: "Continue Enrollment",
  },
];

/* -------------------------------------------------- */
/* Completed enrollments (tab 2)                       */
/* -------------------------------------------------- */
export const completedEnrollments = [
  {
    id: "ENQ-1022",
    candidate: "Asha Patil",
    course: "Web Development",
    location: "Kandivali West",
    documentStatus: "Documents Verified",
    lastUpdated: "03 Jul",
    action: "View Enrollment",
  },
  {
    id: "ENQ-1017",
    candidate: "Sameer Khan",
    course: "Electrical Maintenance",
    location: "Borivali East",
    documentStatus: "Documents Verified",
    lastUpdated: "01 Jul",
    action: "View Enrollment",
  },
  {
    id: "ENQ-1009",
    candidate: "Neha Salvi",
    course: "F&B Service & Production",
    location: "Malad East",
    documentStatus: "Documents Verified",
    lastUpdated: "28 Jun",
    action: "View Enrollment",
  },
  {
    id: "ENQ-1002",
    candidate: "Vikram Desai",
    course: "Graphic Design",
    location: "Akurli road",
    documentStatus: "Documents Verified",
    lastUpdated: "24 Jun",
    action: "View Enrollment",
  },
];

/* -------------------------------------------------- */
/* Table column headings                               */
/*   (kept in data so re-labeling never touches JSX)    */
/* -------------------------------------------------- */
export const enrollmentsTableColumns = [
  { key: "id", label: "Enquiry ID" },
  { key: "candidate", label: "Candidate" },
  { key: "course", label: "Course" },
  { key: "location", label: "Location" },
  { key: "documentStatus", label: "Documents" },
  { key: "lastUpdated", label: "Last Updated" },
  { key: "action", label: "Actions" },
];
