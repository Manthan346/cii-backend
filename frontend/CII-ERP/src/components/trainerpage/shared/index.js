/**
 * shared/index.js
 *
 * Barrel export so any page can write:
 *   import { StatCard, SectionCard, StatusBadge } from "../../shared";
 * instead of deep-importing each component's folder.
 */

export { default as StatCard } from './StatCard/StatCard';
export { default as SectionCard } from './SectionCard/SectionCard';
export { default as StatusBadge } from './StatusBadge/StatusBadge';
export { default as ProgressBar } from './ProgressBar/ProgressBar';
export { default as FileTypeIcon } from './FileTypeIcon/FileTypeIcon';
export { default as PriorityDot } from './PriorityDot/PriorityDot';
export { default as Avatar } from './Avatar/Avatar';

/* ---- Candidate Management additions ----
   Generic UI atoms reusable across any page (not just Candidate
   Management) - filter bars, dropdowns, buttons, pagination footers,
   and row action icon-buttons. */
export { default as Button } from './Button/Button';
export { default as Dropdown } from './Dropdown/Dropdown';
export { default as ActionButtons } from './ActionButtons/ActionButtons';
export { default as Pagination } from './Pagination/Pagination';
export { default as FilterBar } from './FilterBar/FilterBar';
