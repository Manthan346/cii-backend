import React, { useEffect, useState } from 'react';
import StatCard from '../../shared/StatCard/StatCard';
import { fetchDashboardStats } from '../../../../../api/mobilizer/dashboardService';
import './StatsGrid.css';

/**
 * StatsGrid
 * Renders the API's 9 stat cards in a 3-column CSS grid. With 9 items the
 * last row naturally holds just 1 card (grid auto-flow), matching the
 * reference layout — no special-casing needed.
 */
export default function StatsGrid() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchDashboardStats()
      .then((dashboardStats) => {
        if (isMounted) setStats(dashboardStats);
      })
      .catch(() => {
        if (isMounted) setError('Unable to load dashboard stats');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="md-stats-grid">
      {stats.map((stat) => (
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
