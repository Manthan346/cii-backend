/**
 * dashboardData.js
 *
 * Single source of truth for the Mobilizer Dashboard page (fake/mock data).
 * Every dashboard component reads from here instead of hardcoding values,
 * so swapping this for a real API response later is a drop-in change —
 * no component needs to be touched, only this file (or the fetch layer
 * that eventually replaces it).
 *
 * Backend integration note:
 *   Replace each exported constant with data fetched from your API
 *   (e.g. GET /api/mobilizer/dashboard) and keep the same shape.
 */

import {
  Briefcase,
  FileText,
  Phone,
  Share2,
  Monitor,
  LogOut,
} from "lucide-react";

/* -------------------------------------------------- */
/* Overview header                                     */
/* -------------------------------------------------- */
export const overviewInfo = {
  eyebrow: "OVERVIEW",
  title: "Good Morning, Sonal",
  subtitle:
    "Here's how your candidate pipeline and job fairs are moving today, 23 July.",
};

/* -------------------------------------------------- */
/* Top stat cards                                      */
/* -------------------------------------------------- */
export const dashboardStats = [
  {
    id: "total-assigned",
    value: "148",
    label: "Total Assigned",
    icon: Briefcase,
    tone: "blue",
  },
  {
    id: "new-enquiries",
    value: "24",
    label: "New Enquiries",
    icon: FileText,
    tone: "pink",
  },
  {
    id: "calls-pending",
    value: "32",
    label: "Calls Pending",
    icon: Phone,
    tone: "lightblue",
  },
  {
    id: "enrollment-pending",
    value: "11",
    label: "Enrollment Pending",
    icon: Share2,
    tone: "purple",
  },
  {
    id: "successfully-enrolled",
    value: "62",
    label: "Successfully Enrolled",
    icon: Monitor,
    tone: "teal",
  },
  {
    id: "job-fairs-upcoming",
    value: "2",
    label: "Job fairs Upcoming",
    icon: LogOut,
    tone: "orange",
  },
];

/* -------------------------------------------------- */
/* Daily enrollments - line chart (Mon -> Sun)          */
/* -------------------------------------------------- */
export const dailyEnrollments = [
  { day: "Mon", value: 20 },
  { day: "Tue", value: 34 },
  { day: "Wed", value: 30 },
  { day: "Thr", value: 38 },
  { day: "Fri", value: 33 },
  { day: "Sat", value: 21 },
  { day: "Sun", value: 8 },
];

/* -------------------------------------------------- */
/* Candidate status distribution - donut chart           */
/* -------------------------------------------------- */
export const candidateStatusDistribution = [
  { id: "new", label: "New", value: 35, tone: "blue" },
  { id: "not-interested", label: "Not interested", value: 10, tone: "red" },
  { id: "interested", label: "Interested", value: 20, tone: "green" },
  { id: "follow-up", label: "Follow up", value: 15, tone: "lightblue" },
  { id: "called", label: "Called", value: 20, tone: "orange" },
];

/* -------------------------------------------------- */
/* Weekly calls - bar chart (Mon -> Sat)                */
/* -------------------------------------------------- */
export const weeklyCalls = [
  { day: "Mon", value: 88 },
  { day: "Tue", value: 75 },
  { day: "Wed", value: 92 },
  { day: "Thu", value: 57 },
  { day: "Fri", value: 45 },
  { day: "Sat", value: 38 },
];

/* -------------------------------------------------- */
/* Upcoming job fairs list                              */
/* -------------------------------------------------- */
export const upcomingJobFairs = [
  {
    id: "jf-1",
    name: "North Mumbai Job Fair",
    meta: "28 Jul 2026 · CII Skill Centre",
    status: "Upcoming",
  },
  {
    id: "jf-2",
    name: "North Mumbai Job Fair",
    meta: "30 Jul 2026 · Town Hall",
    status: "Upcoming",
  },
  {
    id: "jf-3",
    name: "Kandivali Mini Job Fair",
    meta: "25 Jul 2026 · CII Skill Centre",
    status: "Today",
  },
  {
    id: "jf-4",
    name: "Kandivali Mini Job Fair",
    meta: "31 Jul 2026 · CII Skill Centre",
    status: "Upcoming",
  },
];

/* -------------------------------------------------- */
/* Today's follow-ups list                              */
/* -------------------------------------------------- */
export const todaysFollowups = [
  {
    id: "fu-1",
    name: "Anjali Kadam",
    meta: "Cyber Security",
    status: "New",
  },
  {
    id: "fu-2",
    name: "Rohit Shinde",
    meta: "F&B Service & Production",
    status: "Office Visit Scheduled",
  },
  {
    id: "fu-3",
    name: "Sneha More",
    meta: "Beauty & Wellness",
    status: "Follow-up Required",
  },
  {
    id: "fu-4",
    name: "Ganesh Pawar",
    meta: "Graphic Design",
    status: "New",
  },
];
