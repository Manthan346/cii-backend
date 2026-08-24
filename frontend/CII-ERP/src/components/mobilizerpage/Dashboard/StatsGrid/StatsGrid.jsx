import React from 'react';
import StatCard from '../../shared/StatCard/StatCard';
import { dashboardStats } from '../../data/dashboardData';
import './StatsGrid.css';

/**
 * StatsGrid
 * Renders all 10 stat cards in a 3-column CSS grid. With 10 items the
 * last row naturally holds just 1 card (grid auto-flow), matching the
 * reference layout — no special-casing needed.
 */
export default function StatsGrid() {
  return (
    <div className="md-stats-grid">
      {dashboardStats.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          subtext={stat.subtext}
          subtextTone={stat.subtextTone}
          tone={stat.tone}
        />
      ))}
    </div>
  );
}
