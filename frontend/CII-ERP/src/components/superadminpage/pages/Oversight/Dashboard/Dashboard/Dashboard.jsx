import { useEffect, useState } from "react";
import { LineChart } from "../../../../../adminpage/shared/Charts";
import { Award, Building2, UserRoundCog, Users } from "lucide-react";
import {
  fetchCenterWiseEnrollment,
  fetchDashboardData,
  fetchEnrollmentTrend,
} from "../../../../../../../api/superadmin/dashboardService";
import "./Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [trend, setTrend] = useState({});
  const [centerCounts, setCenterCounts] = useState({});
  const [selectedCentre, setSelectedCentre] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    Promise.all([
      fetchDashboardData(),
      fetchEnrollmentTrend(),
      fetchCenterWiseEnrollment(),
    ])
      .then(([dashboardData, enrollmentTrend, enrollmentByCenter]) => {
        if (!isCurrent) return;
        setDashboard(dashboardData);
        setTrend(enrollmentTrend);
        setCenterCounts(enrollmentByCenter);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load Super Admin dashboard data.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const monthLabels = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 5 + index);
    return date.toLocaleString("en", { month: "short" });
  });
  const enrollmentTrend = monthLabels.map((label) => ({
    label,
    value: Number(trend[label] ?? 0),
  }));
  const centres = Object.entries(centerCounts)
    .map(([name, candidates]) => ({ name, candidates: Number(candidates) }))
    .sort((first, second) => second.candidates - first.candidates);
  const visibleCentres =
    selectedCentre === "all"
      ? centres
      : centres.filter((centre) => centre.name === selectedCentre);
  const maximumCandidates = Math.max(
    ...centres.map((centre) => centre.candidates),
    1,
  );
  const dashboardStats = [
    {
      id: "centres",
      label: "Total centres",
      value: dashboard?.center_count,
      icon: Building2,
    },
    {
      id: "candidates",
      label: "Total candidates",
      value: dashboard?.total_candidates,
      icon: Users,
    },
    {
      id: "staff",
      label: "Staff & trainers",
      value: dashboard?.total_staff,
      icon: UserRoundCog,
    },
    {
      id: "certificates",
      label: "Certificates issued",
      value: dashboard?.certificate_issued,
      icon: Award,
    },
  ];

  const errorMessage = error && (
    <p className="superadmin-feedback superadmin-feedback--error" role="alert">
      {error}
    </p>
  );

  return (
    <div className="superadmin-page">
      <div className="superadmin-heading">
        <h1>System-wide control</h1>
        <p>Complete oversight across all centres, candidates and staff</p>
      </div>
      {errorMessage}
      <div className="superadmin-stat-grid">
        {dashboardStats.map(({ id, label, value, icon: Icon }) => (
          <article className="superadmin-stat" key={id}>
            <span className="superadmin-stat__icon">
              <Icon size={19} />
            </span>
            <div className="superadmin-stat__details">
              <p>{label}</p>
              <strong>
                {isLoading ? "..." : Number(value ?? 0).toLocaleString()}
              </strong>
            </div>
          </article>
        ))}
      </div>
      <div className="superadmin-dashboard-grid">
        <section className="superadmin-card">
          <h2>Candidate enrollment trend</h2>
          <p>New enrollments across all centres, last 6 months</p>
          <div className="superadmin-chart">
            <LineChart
              data={enrollmentTrend}
              yMin={0}
              yMax={Math.max(...enrollmentTrend.map((item) => item.value), 1)}
              yStep={Math.max(
                1,
                Math.ceil(
                  Math.max(...enrollmentTrend.map((item) => item.value), 1) / 5,
                ),
              )}
              height={230}
              color="#188a67"
              areaColor="rgba(24, 138, 103, 0.14)"
            />
          </div>
        </section>
        <section className="superadmin-card">
          <div className="card-heading">
            <div>
              <h2>Centre-wise candidate count</h2>
              <p>Candidates enrolled per centre</p>
            </div>
            <select
              aria-label="Centre filter"
              value={selectedCentre}
              onChange={(event) => setSelectedCentre(event.target.value)}
            >
              <option value="all">All Centres</option>
              {centres.map((centre) => (
                <option key={centre.name} value={centre.name}>
                  {centre.name}
                </option>
              ))}
            </select>
          </div>
          <div className="centre-bars">
            {visibleCentres.map((centre) => (
              <div className="centre-bar" key={centre.id}>
                <span>{centre.name}</span>
                <i>
                  <b
                    style={{
                      width: `${(centre.candidates / maximumCandidates) * 100}%`,
                    }}
                  />
                </i>
                <strong>{centre.candidates.toLocaleString()}</strong>
              </div>
            ))}
            {!isLoading && visibleCentres.length === 0 && (
              <p className="superadmin-feedback">
                No center enrollment data available.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
