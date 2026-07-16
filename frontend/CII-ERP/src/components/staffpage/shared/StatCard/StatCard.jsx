import React from "react";
import "./StatCard.css";

/**
 * StatCard
 *
 * Small metric tile: colored icon badge + big value + label underneath.
 * Generic enough to reuse anywhere a KPI needs to be shown (Dashboard,
 * Candidate Management summary strip, Batch Management summary, etc.),
 * so it lives in /shared rather than inside a single page's folder.
 *
 * Props:
 *  - icon: LucideIcon      -> icon component to render inside the badge
 *  - value: string|number  -> the big headline number/percentage
 *  - label: string         -> caption under the value
 *  - tone: string          -> one of "orange" | "green" | "grey" | "blue"
 *                              (drives the badge background/icon color)
 */
const StatCard = ({ icon: Icon, value, label, tone = "grey" }) => {
  return (
    <div className="stat-card">
      <div className={`stat-card__badge stat-card__badge--${tone}`}>
        {Icon && <Icon size={20} strokeWidth={2} />}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
};

export default StatCard;
