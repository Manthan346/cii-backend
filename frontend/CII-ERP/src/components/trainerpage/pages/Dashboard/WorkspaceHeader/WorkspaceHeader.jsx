import React from 'react';
import { Users, Layers } from 'lucide-react';
import { StatCard } from '../../../shared';
import './WorkspaceHeader.css';

/**
 * WorkspaceHeader
 *
 * Top block of the Dashboard: workspace title + a short status line,
 * followed by the available KPI stat cards (Total Candidates, Active
 * Batches). Dashboard-specific
 * composition, so it stays in pages/Dashboard/components, but it's
 * built entirely from the reusable <StatCard> in /shared.
 */
const WorkspaceHeader = ({ summary }) => {
  return (
    <div className="workspace-header">
      <h1 className="workspace-header__title">Trainer Workspace</h1>
      <p className="workspace-header__subtitle">Overview of your batches</p>

      <div className="workspace-header__stats">
        <StatCard icon={Users} tone="blue" label="Total Candidates" value={summary?.totalCandidates ?? 0} />
        <StatCard icon={Layers} tone="green" label="Active Batches" value={summary?.activeBatches ?? 0} />
      </div>
    </div>
  );
};

export default WorkspaceHeader;
