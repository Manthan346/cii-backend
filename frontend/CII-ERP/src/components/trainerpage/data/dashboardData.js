/**
 * dashboardData.js
 *
 * Single source of truth for the Staff Dashboard page (fake/mock data).
 * Every dashboard component below reads from here instead of hardcoding
 * values, so swapping this for a real API response later is a drop-in
 * change — no component needs to be touched, only this file (or the
 * fetch layer that eventually replaces it).
 *
 * Backend integration note:
 *   Replace each exported constant with data fetched from your API
 *   (e.g. GET /api/staff/dashboard) and keep the same shape.
 */

import {
  UserRound,
  CheckCircle2,
  ClipboardList,
  CalendarCheck,
} from 'lucide-react';

/* -------------------------------------------------- */
/* Workspace header                                    */
/* -------------------------------------------------- */
export const workspaceInfo = {
  title: 'Trainer Workspace',
  subtitle: 'Rohit mehta, data science vertical, 6 active batches',
};

/* -------------------------------------------------- */
/* Top stat cards                                      */
/* -------------------------------------------------- */
export const dashboardStats = [
  {
    id: 'candidates-assigned',
    value: '128',
    label: 'Candidate Assigned',
    icon: UserRound,
    tone: 'orange',
  },
  {
    id: 'active-batches',
    value: '6',
    label: 'Active batches',
    icon: CheckCircle2,
    tone: 'green',
  },
  {
    id: 'pending-tasks',
    value: '9',
    label: 'Pending Tasks',
    icon: ClipboardList,
    tone: 'grey',
  },
  {
    id: 'today-attendance',
    value: '94%',
    label: 'Today Attendance',
    icon: CalendarCheck,
    tone: 'blue',
  },
];

/* -------------------------------------------------- */
/* Batch overview table                                 */
/* -------------------------------------------------- */
export const batchOverview = [
  {
    id: 'ds-24',
    batch: 'DS-24',
    course: 'Data Science',
    candidates: 32,
    progress: 78,
    status: 'Active',
  },
  {
    id: 'py-18',
    batch: 'PY-18',
    course: 'Python Programming',
    candidates: 26,
    progress: 64,
    status: 'Active',
  },
  {
    id: 'bc-08',
    batch: 'BC-08',
    course: 'Business Comm.',
    candidates: 22,
    progress: 40,
    status: 'Completed',
  },
  {
    id: 'sqi-05',
    batch: 'SQI-05',
    course: 'SQL Essentials',
    candidates: 18,
    progress: 30,
    status: 'Active',
  },
];

/* -------------------------------------------------- */
/* Task assigned list                                   */
/* -------------------------------------------------- */
export const tasksAssigned = [
  {
    id: 'task-1',
    title: 'Grade SQL Essentials Assessments',
    due: 'Due Today',
    priority: 'High',
  },
  {
    id: 'task-2',
    title: 'Upload week 6 Slide for DS-24',
    due: 'Due Tomorrow',
    priority: 'Medium',
  },
  {
    id: 'task-3',
    title: 'Submit Attendence For BC-09',
    due: 'Due in 3 days',
    priority: 'Low',
  },
  {
    id: 'task-4',
    title: 'Prepare PY-18 Batch report',
    due: 'Due in 4 days',
    priority: 'Medium',
  },
];

/* -------------------------------------------------- */
/* Attendance - last 7 days (bar chart)                  */
/* -------------------------------------------------- */
export const attendanceLast7Days = [
  { day: 'MON', value: 92 },
  { day: 'TUE', value: 84 },
  { day: 'WED', value: 55 },
  { day: 'THU', value: 96 },
  { day: 'FRI', value: 100, projected: true },
  { day: 'SAT', value: 88 },
  { day: 'SUN', value: 0 },
];

/* -------------------------------------------------- */
/* Recent material uploads                               */
/* -------------------------------------------------- */
export const recentUploads = [
  {
    id: 'upload-1',
    name: 'DS-24 - Week 6 slides.pdf',
    fileType: 'pdf',
    uploadedAt: '2 hours ago',
  },
  {
    id: 'upload-2',
    name: 'PY-18 - Loops& Functions.pptx',
    fileType: 'pptx',
    uploadedAt: 'Yesterday',
  },
  {
    id: 'upload-3',
    name: 'SQI-05 - Practice set 3.docx',
    fileType: 'doc',
    uploadedAt: 'Yesterday',
  },
];
