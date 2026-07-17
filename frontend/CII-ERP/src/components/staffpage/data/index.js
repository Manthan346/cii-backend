/**
 * index.js
 *
 * Barrel export for staffpage/data so consumers can write:
 *   import { sidebarMenu } from "../data";
 * instead of reaching into individual files. Add future config/data
 * modules (e.g. topbarConfig, userRoles) here as they're created.
 */

export { sidebarMenu } from "./sidebarMenu";
export {
  workspaceInfo,
  dashboardStats,
  batchOverview,
  tasksAssigned,
  attendanceLast7Days,
  recentUploads,
} from "./dashboardData";

/* ---- Candidate Management additions ---- */
export { candidateStats } from "./stats";
export { candidates } from "./candidates";
export { batchOptions, courseOptions, statusOptions } from "./filterOptions";

/* ---- Batch Management additions ---- */
export { batches, batchListMeta } from "./batches";
export { batchStats } from "./batchStats";
export { trainers } from "./trainers";
export {
  courseSelectOptions,
  sessionTimeOptions,
  classroomOptions,
  daysOfWeek,
} from "./batchFormOptions";
export {
  trainerFilterOptions,
  batchCourseOptions,
  batchStatusOptions,
} from "./filterOptions";

/* ---- Attendance Management additions ---- */
export { attendanceStatusOptions } from "./filterOptions";
export {
  attendanceStats,
  attendanceMeta,
  attendanceRecords,
} from "./attendanceData";
