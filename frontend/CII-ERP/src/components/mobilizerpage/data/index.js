/**
 * index.js
 *
 * Barrel export for mobilizerpage/data so consumers can write:
 *   import { sidebarMenu, dashboardStats } from "../data";
 * instead of reaching into individual files. Add future config/data
 * modules (e.g. topbarConfig, userRoles) here as they're created.
 */

export { sidebarMenu, jobFairIcons } from "./sidebarMenu";

export {
  overviewInfo,
  dashboardStats,
  dailyEnrollments,
  candidateStatusDistribution,
  weeklyCalls,
  upcomingJobFairs,
  todaysFollowups,
} from "./dashboardData";
