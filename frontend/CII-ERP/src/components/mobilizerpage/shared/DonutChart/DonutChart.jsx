import React from "react";
import "./DonutChart.css";

/**
 * DonutChart
 *
 * Dependency-free donut chart built with plain SVG `stroke-dasharray`
 * segments on a circle (no charting library), plus a legend of colored
 * count chips below. Generic over any `[{ id, label, value, tone }]`
 * distribution, so it's reused by Candidate Status Distribution today
 * and any other breakdown chart later — which is why it lives in
 * /shared rather than inside the Dashboard page folder.
 *
 * Props:
 *  - data: [{ id, label, value, tone }]
 *      tone maps to a CSS custom property color via TONE_COLOR below.
 */
const TONE_COLOR = {
  blue: "#2f4bd6",
  red: "#d64545",
  green: "#22c55e",
  lightblue: "#a8c8f0",
  orange: "#f5a623",
  purple: "#9b59d0",
  teal: "#14b8a6",
};

const SIZE = 220;
const STROKE = 34;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  let offsetAccumulator = 0;
  const segments = data.map((d) => {
    const fraction = d.value / total;
    const dash = fraction * CIRCUMFERENCE;
    const segment = {
      ...d,
      color: TONE_COLOR[d.tone] || "#9199a6",
      dash,
      gap: CIRCUMFERENCE - dash,
      offset: -offsetAccumulator,
    };
    offsetAccumulator += dash;
    return segment;
  });

  return (
    <div className="m-donut-chart">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="m-donut-chart__svg">
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          {segments.map((seg) => (
            <circle
              key={seg.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={seg.offset}
            />
          ))}
        </g>
      </svg>

      <div className="m-donut-chart__legend">
        {data.map((d) => (
          <div className="m-donut-chart__legend-item" key={d.id}>
            <span
              className="m-donut-chart__chip"
              style={{ background: TONE_COLOR[d.tone] || "#9199a6" }}
            >
              {d.value}
            </span>
            <span className="m-donut-chart__legend-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
