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
export { default as Avatar } from "./Avatar/Avatar";
export { default as ListRow } from "./ListRow/ListRow";
export { default as LineChart } from "./LineChart/LineChart";
export { default as BarChart } from "./BarChart/BarChart";
export { default as DonutChart } from "./DonutChart/DonutChart";
