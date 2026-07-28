import React from "react";
import useCountUp from "../hooks/useCountUp";
import "./StatCard.css";

/**
 * StatCard
 *
 * KPI tile used across the Mobilizer dashboard: big headline value +
 * label, with a colored circular icon badge floated to the top-right
 * corner of the card (matches the "Total Assigned / New Enquiries /
 * Calls Pending..." row in the Dashboard design).
 *
 * Generic enough to reuse anywhere a KPI needs to be shown, so it
 * lives in /shared rather than inside a single page's folder.
 *
 * Props:
 *  - icon: LucideIcon      -> icon component to render inside the badge
 *  - value: string|number  -> the big headline number/percentage
 *  - label: string         -> caption under the value
 *  - tone: string          -> one of "blue" | "pink" | "lightblue" |
 *                              "purple" | "teal" | "orange" | "green"
 *                              (drives the badge background/icon color)
 *
 * The headline number counts up from 0 to `value` on mount via
 * useCountUp (handles both plain numbers and "94%"-style strings).
 */
const StatCard = ({ icon: Icon, value, label, tone = "blue" }) => {
  const animatedValue = useCountUp(value, 1200);

  return (
    <div className="m-stat-card">
      <div className={`m-stat-card__badge m-stat-card__badge--${tone}`}>
        {Icon && <Icon size={18} strokeWidth={2} />}
      </div>
      <div className="m-stat-card__value">{animatedValue}</div>
      <div className="m-stat-card__label">{label}</div>
    </div>
  );
};

export default StatCard;
