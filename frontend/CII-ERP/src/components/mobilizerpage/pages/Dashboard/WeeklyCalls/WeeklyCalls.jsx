import React from "react";
import { SectionCard, BarChart } from "../../../shared";
import { weeklyCalls } from "../../../data";
import "./WeeklyCalls.css";

/**
 * WeeklyCalls
 *
 * Dashboard card showing the number of calls made per day this week
 * (Mon -> Sat) as a bar chart. Composed with the reusable <SectionCard>
 * and <BarChart> from /shared; only the data + chart-specific scale
 * (0-100, step 20) live here.
 */
const WeeklyCalls = () => {
  return (
    <SectionCard title="Weekly Calls" className="weekly-calls">
      <BarChart data={weeklyCalls} maxValue={100} step={20} color="#16214b" />
    </SectionCard>
  );
};

export default WeeklyCalls;
