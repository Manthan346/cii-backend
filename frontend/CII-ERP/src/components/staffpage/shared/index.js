/**
 * shared/index.js
 *
 * Barrel export so any page can write:
 *   import { StatCard, SectionCard, StatusBadge } from "../../shared";
 * instead of deep-importing each component's folder.
 */

export { default as StatCard } from "./StatCard/StatCard";
export { default as SectionCard } from "./SectionCard/SectionCard";
export { default as StatusBadge } from "./StatusBadge/StatusBadge";
export { default as ProgressBar } from "./ProgressBar/ProgressBar";
export { default as FileTypeIcon } from "./FileTypeIcon/FileTypeIcon";
export { default as PriorityDot } from "./PriorityDot/PriorityDot";
export { default as Avatar } from "./Avatar/Avatar";
