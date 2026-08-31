import React, { useEffect, useState } from "react";
import StatCard from "../shared/StatCard/StatCard";
import BarChartCard from "../shared/BarChartCard/BarChartCard";
import DonutChartCard from "../shared/DonutChartCard/DonutChartCard";
import {
  fetchRecruiterApplicationsPerJob,
  fetchRecruiterDashboard,
  fetchRecruiterApplicationsByStatus,
  statCards,
} from "../../../../api/recruiter/dashboardService";
import "./Dashboard.css";

/**
 * Dashboard (Recruiter)
 *
 * Top-level page rendered into RecruiterLayout's <Outlet /> at
 * /recruiter/dashboard. Composed from shared/ components, each fed
 * this page's slice of data via props:
 *
 *   - StatCard (x8)      <- statCards
 *   - BarChartCard        <- applicationsPerJob      (xKey="job")
 *   - DonutChartCard      <- applicationsByStatus     (labelKey="status")
 *
 * Recent Activity and Hiring Progress sections removed per request —
 * no backend support existed for either yet.
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

  const [applicationsByStatusData, setApplicationsByStatusData] = useState([]);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const loadApplicationsByStatus = async () => {
      try {
        setStatusError("");
        setApplicationsByStatusData(await fetchRecruiterApplicationsByStatus());
      } catch (error) {
        console.error("Failed to load applications by status:", error);
        setStatusError(
          error?.response?.data?.message ||
            "Unable to load application status breakdown right now.",
        );
      }
    };

    loadApplicationsByStatus();
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
          data={applicationsByStatusData}
          labelKey="status"
          valueKey="value"
          colorKey="color"
        />
      </div>

      {graphError && (
        <p className="recruiter-dashboard__metrics-error">{graphError}</p>
      )}

      {statusError && (
        <p className="recruiter-dashboard__metrics-error">{statusError}</p>
      )}
    </div>
  );
};

export default Dashboard;
