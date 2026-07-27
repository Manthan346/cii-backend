import React from "react";
import { StatCard } from "../../../shared";
import { overviewInfo, dashboardStats } from "../../../data";
import "./OverviewHeader.css";

/**
 * OverviewHeader
 *
 * Top block of the Mobilizer Dashboard: small orange "OVERVIEW" eyebrow,
 * greeting title + status line, followed by the row of 6 KPI stat cards
 * (Total Assigned, New Enquiries, Calls Pending, Enrollment Pending,
 * Successfully Enrolled, Job fairs Upcoming). Dashboard-specific
 * composition, so it stays in pages/Dashboard/OverviewHeader, but it's
 * built entirely from the reusable <StatCard> in /shared.
 */
const OverviewHeader = () => {
  return (
    <div className="overview-header">
      <p className="overview-header__eyebrow">{overviewInfo.eyebrow}</p>
      <h1 className="overview-header__title">{overviewInfo.title}</h1>
      <p className="overview-header__subtitle">{overviewInfo.subtitle}</p>

      <div className="overview-header__stats">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            tone={stat.tone}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewHeader;
