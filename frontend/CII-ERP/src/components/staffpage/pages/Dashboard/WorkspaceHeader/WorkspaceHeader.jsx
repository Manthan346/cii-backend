import React from "react";
import { StatCard } from "../../../shared";
import { workspaceInfo, dashboardStats } from "../../../data";
import "./WorkspaceHeader.css";

/**
 * WorkspaceHeader
 *
 * Top block of the Dashboard: workspace title + a short status line,
 * followed by the row of 4 KPI stat cards (Candidates Assigned, Active
 * batches, Pending Tasks, Today Attendance). Dashboard-specific
 * composition, so it stays in pages/Dashboard/components, but it's
 * built entirely from the reusable <StatCard> in /shared.
 */
const WorkspaceHeader = () => {
  return (
    <div className="workspace-header">
      <h1 className="workspace-header__title">{workspaceInfo.title}</h1>
      <p className="workspace-header__subtitle">{workspaceInfo.subtitle}</p>

      <div className="workspace-header__stats">
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

export default WorkspaceHeader;
