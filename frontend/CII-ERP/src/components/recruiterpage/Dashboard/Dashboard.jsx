import React from 'react';
import StatCard from '../shared/StatCard/StatCard';
import BarChartCard from '../shared/BarChartCard/BarChartCard';
import DonutChartCard from '../shared/DonutChartCard/DonutChartCard';
import ActivityFeedCard from '../shared/ActivityFeedCard/ActivityFeedCard';
import ProgressBarCard from '../shared/ProgressBarCard/ProgressBarCard';
import { statCards, applicationsPerJob, applicationsByStatus, recentActivity, hiringProgress } from '../data';
import './Dashboard.css';

/**
 * Dashboard (Recruiter)
 *
 * Top-level page rendered into RecruiterLayout's <Outlet /> at
 * /recruiter/dashboard. Now composed entirely from the reusable
 * shared/ components, each fed this page's slice of
 * data/dashboardData.js via props:
 *
 *   - StatCard (x8)      <- statCards
 *   - BarChartCard        <- applicationsPerJob      (xKey="job")
 *   - DonutChartCard      <- applicationsByStatus     (labelKey="status")
 *   - ActivityFeedCard    <- recentActivity
 *   - ProgressBarCard     <- hiringProgress           (labelKey="stage")
 *
 * These shared/ components have no idea they're on a recruiter
 * dashboard - other sections (Job Management, Placement Management,
 * Applications, ...) can reuse them with their own titles/data/keys.
 *
 * NOTE: the reference design also has a "Recent Applications" table
 * below Hiring Progress - intentionally left out of this page per
 * request. Add a shared ApplicationsTable/ component here the same
 * way if that's wanted later.
 */
const Dashboard = () => {
  return (
    <div className="recruiter-dashboard">
      <header className="recruiter-dashboard__header">
        <h1 className="recruiter-dashboard__title">Recruiter Dashboard</h1>
        <p className="recruiter-dashboard__subtitle">
          Overview of your hiring activity and job performance
        </p>
      </header>

      <div className="recruiter-dashboard__stats">
        {statCards.map((card) => (
          <StatCard
            key={card.id}
            icon={card.icon}
            iconBg={card.iconBg}
            value={card.value}
            label={card.label}
          />
        ))}
      </div>

      <div className="recruiter-dashboard__row">
        <BarChartCard
          title="Applications per job"
          data={applicationsPerJob}
          xKey="job"
          valueKey="value"
        />
        <DonutChartCard
          title="Applications by status"
          data={applicationsByStatus}
          labelKey="status"
          valueKey="value"
          colorKey="color"
        />
      </div>

      <div className="recruiter-dashboard__row">
        <ActivityFeedCard title="Recent Activity" items={recentActivity} />
        <ProgressBarCard
          title="Hiring Progress"
          items={hiringProgress}
          labelKey="stage"
          countKey="count"
          percentKey="percent"
        />
      </div>
    </div>
  );
};

export default Dashboard;
