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

/* ---- Resources additions ---- */
export {
  resourceStats,
  quickAccessCards,
  resourceCategoryOptions,
  resourceTypeOptions,
  resourceMeta,
  resourceRecords,
} from "./resourcesData";

/* ---- Study Material Upload additions ---- */
export { materialTypeOptions, materialStatusOptions } from "./filterOptions";
export {
  materialStats,
  materialMeta,
  materialRecords,
} from "./studyMaterialData";

/* ---- Reports additions ---- */
export {
  reportStats,
  attendanceOverviewByBatch,
  attendanceOverviewMeta,
  reportTypeOptions,
  reportBatchOptions,
  reportFormatOptions,
  reportMeta,
  reportRecords,
} from "./reportsData";

/* ---- Work additions ---- */
export {
  workStats,
  workShortcuts,
  recentActivity,
  workMeta,
} from "./workData";

/* ---- Task Assigned (full page) additions ---- */
export { taskAssigneeOptions, taskPriorityOptions, taskStatusOptions } from "./filterOptions";
export {
  taskAssignedStats,
  taskAssignedMeta,
  taskAssignedRecords,
} from "./tasksAssignedData";
