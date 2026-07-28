import React from "react";
import { SectionCard, LineChart } from "../../../shared";
import { dailyEnrollments } from "../../../data";
import "./DailyEnrollments.css";

/**
 * DailyEnrollments
 *
 * Dashboard card showing the daily enrollments trend (Mon -> Sun) as a
 * smooth line chart. Composed with the reusable <SectionCard> and
 * <LineChart> from /shared; only the data + chart-specific scale
 * (0-50, step 10) live here.
 */
const DailyEnrollments = () => {
  return (
    <SectionCard title="Daily Enrollments" className="daily-enrollments">
      <LineChart data={dailyEnrollments} maxValue={50} step={10} color="#3b82f6" />
    </SectionCard>
  );
};

export default DailyEnrollments;
