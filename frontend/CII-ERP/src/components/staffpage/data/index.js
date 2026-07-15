/**
 * index.js
 *
 * Barrel export for staffpage/data so consumers can write:
 *   import { sidebarMenu } from "../data";
 * instead of reaching into individual files. Add future config/data
 * modules (e.g. topbarConfig, userRoles) here as they're created.
 */

export { sidebarMenu } from "./sidebarMenu";
