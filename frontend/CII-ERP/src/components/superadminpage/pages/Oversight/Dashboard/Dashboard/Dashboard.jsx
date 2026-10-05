import { useState } from "react";
import { LineChart } from "../../../../../adminpage/shared/Charts";
import { centres, dashboardStats, enrollmentTrend } from "../../../../data";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedCentre, setSelectedCentre] = useState("all");
  const visibleCentres = selectedCentre === "all"
    ? centres
    : centres.filter((centre) => centre.id === selectedCentre);

  return (
    <div className="superadmin-page">
      <div className="superadmin-heading">
        <h1>System-wide control</h1>
        <p>Complete oversight across all centres, candidates and staff</p>
      </div>
      <div className="superadmin-stat-grid">
        {dashboardStats.map(({ id, label, value, icon: Icon }) => (
          <article className="superadmin-stat" key={id}>
            <span className="superadmin-stat__icon"><Icon size={19} /></span>
            <div className="superadmin-stat__details">
              <p>{label}</p>
              <strong>{value}</strong>
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
              yMax={5000}
              yStep={1000}
              height={230}
              color="#8954ee"
              areaColor="rgba(137, 84, 238, 0.14)"
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
                <option key={centre.id} value={centre.id}>{centre.city}</option>
              ))}
            </select>
          </div>
          <div className="centre-bars">
            {visibleCentres.map((centre) => (
              <div className="centre-bar" key={centre.id}>
                <span>{centre.city}</span>
                <i><b style={{ width: `${(centre.candidates / 5200) * 100}%` }} /></i>
                <strong>{centre.candidates.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
