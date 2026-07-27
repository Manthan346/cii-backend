import React from "react";
import { enquiryStats } from "../../../data";
import "./EnquiryStats.css";

/**
 * EnquiryStats
 *
 * Row of 4 plain KPI tiles for the Enquiries page (Total Enquires, New
 * enquires, Centre Visited, Uncontacted candidates). Visually simpler
 * than the Dashboard's <StatCard> — a small dark icon sits above the
 * number instead of a colored circular badge — so this page keeps its
 * own lightweight tile here rather than reusing /shared/StatCard.
 *
 * Data (icon, value, label) lives in `enquiryStats`
 * (data/enquiryData.js) so numbers can be swapped for a live API
 * response without touching this component.
 */
const EnquiryStats = () => {
  return (
    <div className="enquiry-stats">
      {enquiryStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="enquiry-stats__card">
            {Icon && (
              <span
                className={`enquiry-stats__icon ${
                  stat.filled ? "enquiry-stats__icon--filled" : ""
                }`}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
            )}
            <div className="enquiry-stats__value">{stat.value}</div>
            <div className="enquiry-stats__label">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default EnquiryStats;
