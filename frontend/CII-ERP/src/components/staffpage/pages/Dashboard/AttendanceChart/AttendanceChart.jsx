import React from "react";
import { SectionCard } from "../../../shared";
import { attendanceLast7Days } from "../../../data";
import "./AttendanceChart.css";

const Y_AXIS_STEPS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

/**
 * AttendanceChart
 *
 * Simple, dependency-free bar chart showing attendance percentage for
 * the last 7 days. Built with plain divs sized by inline height
 * percentages rather than a charting library, keeping this Dashboard
 * component lightweight and easy to restyle. Wrapped in the reusable
 * <SectionCard>.
 */
const AttendanceChart = () => {
  return (
    <SectionCard title="Attendance - Last 7 days" className="attendance-chart">
      <div className="attendance-chart__grid">
        <div className="attendance-chart__y-axis">
          {Y_AXIS_STEPS.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>

        <div className="attendance-chart__plot">
          {Y_AXIS_STEPS.map((step) => (
            <div className="attendance-chart__gridline" key={step} />
          ))}

          <div className="attendance-chart__bars">
            {attendanceLast7Days.map((day) => (
              <div className="attendance-chart__bar-col" key={day.day}>
                <div
                  className={`attendance-chart__bar ${
                    day.projected ? "attendance-chart__bar--projected" : ""
                  }`}
                  style={{ height: `${day.value}%` }}
                  title={`${day.day}: ${day.value}%`}
                />
                <span className="attendance-chart__day-label">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default AttendanceChart;
