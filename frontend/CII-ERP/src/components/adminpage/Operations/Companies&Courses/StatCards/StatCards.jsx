import StatCard from "../../../shared/StatCard/StatCard";
import "./StatCards.css";

/**
 * StatsOverview
 *
 * KPI row at the top of the Dashboard: Total User, Total Candidates,
 * Total staff, Monthly Enrollments (or whatever `stats` is passed in
 * for other pages that reuse this block).
 *
 * Props:
 *  - stats: array of { id, label, value, icon, iconBg, trendValue, trendDirection }
 *           see Dashboard/data.js -> summaryStats for the shape.
 */
const StatCards = ({ stats = [] }) => {
  return (
    <div className="companies-courses-statscards">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconBg={stat.iconBg}
        />
      ))}
    </div>
  );
};

export default StatCards;
