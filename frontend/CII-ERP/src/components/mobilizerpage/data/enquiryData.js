/**
 * enquiryData.js
 *
 * Single source of truth for the Mobilizer Enquiries page (fake/mock
 * data). Every Enquiry component reads from here instead of
 * hardcoding values, so swapping this for a real API response later is
 * a drop-in change — no component needs to be touched, only this file
 * (or the fetch layer that eventually replaces it).
 *
 * Backend integration note:
 *   Replace each exported constant with data fetched from your API
 *   (e.g. GET /api/mobilizer/enquiries) and keep the same shape.
 */

import { FileText, FileEdit, BadgeCheck, Users } from "lucide-react";

/* -------------------------------------------------- */
/* Page header                                         */
/* -------------------------------------------------- */
export const enquiryInfo = {
  title: "Enquiries",
  subtitle: "Leads received from the landing page, before enrollment begins",
  actionLabel: "+ Add new Candidate",
};

/* -------------------------------------------------- */
/* Info banner                                         */
/* -------------------------------------------------- */
export const enquiryInfoBanner = {
  highlight: "Enquiries",
  text:
    "Are candidates you are still calling and qualifying. Once they visit and verify, move them to enrollments to complete enrollment form.",
};

/* -------------------------------------------------- */
/* Top stat cards                                      */
/* -------------------------------------------------- */
export const enquiryStats = [
  {
    id: "total-enquiries",
    icon: FileText,
    value: "1,200",
    label: "Total Enquires",
  },
  {
    id: "new-enquiries",
    icon: FileEdit,
    value: "100",
    label: "New enquires",
  },
  {
    id: "centre-visited",
    icon: BadgeCheck,
    value: "450",
    label: "Centre Visited",
    filled: true,
  },
  {
    id: "uncontacted-candidates",
    icon: Users,
    value: "150",
    label: "Uncontacted candidates",
  },
];

/* -------------------------------------------------- */
/* Course filter options (search bar dropdown)         */
/* -------------------------------------------------- */
export const courseFilterOptions = [
  "All Courses",
  "Cyber Security",
  "Graphic Design",
  "Beauty & Wellness",
  "Housekeeping",
  "F&B Service & Production",
];

/* -------------------------------------------------- */
/* Status filter tabs                                  */
/*   `id` is matched against each candidate's `status`  */
/*   (lowercased) to filter the table, "all" shows every */
/*   row regardless of status.                          */
/* -------------------------------------------------- */
export const enquiryFilterTabs = [
  { id: "all", label: "All", count: 1200 },
  { id: "new enquiries", label: "New Enquiries" },
  { id: "pending verification", label: "Pending Verification" },
  { id: "verifying", label: "Verifying" },
  { id: "dropped out", label: "Dropped out" },
];

/* -------------------------------------------------- */
/* Status -> tone mapping (used by the shared           */
/* StatusBadge on the table's Status column)             */
/* -------------------------------------------------- */
export const enquiryStatusMeta = {
  "dropped out": "red",
  "visited centre": "orange",
  verifying: "lightblue",
  "not visited": "orange",
  "new enquiries": "blue",
};

/* -------------------------------------------------- */
/* Table column headings                               */
/*   (kept in data so re-labeling never touches JSX)    */
/* -------------------------------------------------- */
export const enquiryTableColumns = [
  { key: "name", label: "Name" },
  { key: "course", label: "Course" },
  { key: "area", label: "Area" },
  { key: "enquiryDate", label: "Enquiry Date" },
  { key: "contact", label: "Contact" },
  { key: "status", label: "Status" },
];

/* -------------------------------------------------- */
/* Candidate rows                                      */
/* -------------------------------------------------- */
export const enquiries = [
  {
    id: "RP2058",
    name: "Rekha Patil",
    course: "Cyber Security",
    area: "Kandivali west",
    enquiryDate: "14 July",
    contact: "872478543",
    status: "Dropped Out",
  },
  {
    id: "R5439",
    name: "Rajesha sharma",
    course: "Beauty & Wellness",
    area: "Akurli road",
    enquiryDate: "12 July",
    contact: "6734567832",
    status: "Visited centre",
  },
  {
    id: "VP4407",
    name: "Vaishnavi Patil",
    course: "Cyber Security",
    area: "Kandivali,East",
    enquiryDate: "4 july",
    contact: "5423459830",
    status: "Verifying",
  },
  {
    id: "RP4407",
    name: "Ritu Patil",
    course: "Cyber Security",
    area: "Kandivali,west",
    enquiryDate: "10 july",
    contact: "5423459837",
    status: "Dropped Out",
  },
  {
    id: "RP4407",
    name: "Kiran pawar",
    course: "Housekeeping",
    area: "Akurli Road",
    enquiryDate: "8 july",
    contact: "5423459837",
    status: "Not Visited",
  },
];

/* -------------------------------------------------- */
/* Pagination                                          */
/* -------------------------------------------------- */
export const enquiryPaginationInfo = {
  rangeStart: 1,
  rangeEnd: 5,
  total: 1200,
  currentPage: 2,
  lastPage: 60,
};
