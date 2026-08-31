import React, { useEffect, useState } from "react";
import StatCard from '../shared/StatCard/StatCard';
import BarChartCard from '../shared/BarChartCard/BarChartCard';
import DonutChartCard from '../shared/DonutChartCard/DonutChartCard';
import ActivityFeedCard from '../shared/ActivityFeedCard/ActivityFeedCard';
import ProgressBarCard from '../shared/ProgressBarCard/ProgressBarCard';
import { statCards, applicationsByStatus, recentActivity, hiringProgress } from '../data';
import {
  fetchRecruiterApplicationsPerJob,
  fetchRecruiterDashboard,
} from "../../../../api/recruiter/dashboardService";
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
  const [dashboardMetrics, setDashboardMetrics] = useState({});
  const [applicationsPerJobData, setApplicationsPerJobData] = useState([]);
  const [metricsError, setMetricsError] = useState("");
  const [graphError, setGraphError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setMetricsError("");
        setDashboardMetrics(await fetchRecruiterDashboard());
      } catch (error) {
        console.error("Failed to load recruiter dashboard:", error);
        setMetricsError(
          error?.response?.data?.message ||
            "Unable to load dashboard metrics right now.",
        );
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const loadApplicationsPerJob = async () => {
      try {
        setGraphError("");
        const records = await fetchRecruiterApplicationsPerJob();
        setApplicationsPerJobData(
          records.map((record) => ({
            id: record.placement_id,
            job: record.job_role ?? "Untitled role",
            value: Number(record.application_count ?? 0),
          })),
        );
      } catch (error) {
        console.error("Failed to load applications per job:", error);
        setGraphError(
          error?.response?.data?.message ||
            "Unable to load applications per job right now.",
        );
      }
    };

    loadApplicationsPerJob();
  }, []);

  const graphData = applicationsPerJobData;
  const graphMaximum = Math.max(100, ...graphData.map((item) => item.value));
  const graphCeiling = Math.ceil(graphMaximum / 20) * 20;
  const graphTicks = Array.from(
    { length: 6 },
    (_, index) => (graphCeiling / 5) * index,
  );

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
            value={dashboardMetrics[card.metric] ?? 0}
            label={card.label}
          />
        ))}
      </div>

      {metricsError && (
        <p className="recruiter-dashboard__metrics-error">{metricsError}</p>
      )}

      <div className="recruiter-dashboard__row">
        <BarChartCard
          title="Applications per job"
          data={graphData}
          xKey="job"
          valueKey="value"
          yDomain={[0, graphCeiling]}
          yTicks={graphTicks}
        />
        <DonutChartCard
          title="Applications by status"
          data={applicationsByStatus}
          labelKey="status"
          valueKey="value"
          colorKey="color"
        />
      </div>

      {graphError && (
        <p className="recruiter-dashboard__metrics-error">{graphError}</p>
      )}

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
