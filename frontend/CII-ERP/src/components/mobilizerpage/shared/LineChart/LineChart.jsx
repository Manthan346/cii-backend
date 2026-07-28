import React from "react";
import "./LineChart.css";

/**
 * LineChart
 *
 * Dependency-free smooth line chart built with plain SVG (no charting
 * library), so it stays lightweight and easy to restyle. Generic over
 * any `[{ day, value }]` series, so it's reused by Daily Enrollments
 * today and by any other trend chart later — which is why it lives in
 * /shared rather than inside the Dashboard page folder.
 *
 * Props:
 *  - data: [{ day: string, value: number }]  -> the series to plot
 *  - maxValue: number   -> top of the y-axis scale (default 50)
 *  - step: number       -> gridline step (default 10)
 *  - color: string      -> CSS color for the line + dots (default brand blue)
 */
const WIDTH = 700;
const HEIGHT = 260;
const PADDING_LEFT = 36;
const PADDING_RIGHT = 12;
const PADDING_TOP = 14;
const PADDING_BOTTOM = 28;

const buildSmoothPath = (points) => {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 === points.length ? i + 1 : i + 2];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const LineChart = ({ data, maxValue = 50, step = 10, color = "#3b82f6" }) => {
  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const ySteps = [];
  for (let v = maxValue; v >= 0; v -= step) ySteps.push(v);

  const points = data.map((point, i) => {
    const x = PADDING_LEFT + (plotWidth * i) / (data.length - 1 || 1);
    const y =
      PADDING_TOP + plotHeight - (Math.min(point.value, maxValue) / maxValue) * plotHeight;
    return { x, y, ...point };
  });

  const linePath = buildSmoothPath(points);
  const areaPath =
    `${linePath} L ${points[points.length - 1].x} ${PADDING_TOP + plotHeight} ` +
    `L ${points[0].x} ${PADDING_TOP + plotHeight} Z`;

  return (
    <div className="m-line-chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="m-line-chart__svg"
        preserveAspectRatio="none"
      >
        {/* Gridlines + y-axis labels */}
        {ySteps.map((v) => {
          const y = PADDING_TOP + plotHeight - (v / maxValue) * plotHeight;
          return (
            <g key={v}>
              <line
                x1={PADDING_LEFT}
                x2={WIDTH - PADDING_RIGHT}
                y1={y}
                y2={y}
                className="m-line-chart__gridline"
              />
              <text x={PADDING_LEFT - 10} y={y + 4} className="m-line-chart__y-label" textAnchor="end">
                {v}
              </text>
            </g>
          );
        })}

        {/* Area fill under the curve */}
        <path d={areaPath} fill={color} opacity="0.08" stroke="none" />

        {/* Smooth line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

        {/* Dots */}
        {points.map((p) => (
          <circle key={p.day} cx={p.x} cy={p.y} r="4.5" fill={color} stroke="#ffffff" strokeWidth="1.5" />
        ))}

        {/* X-axis labels */}
        {points.map((p) => (
          <text
            key={`label-${p.day}`}
            x={p.x}
            y={HEIGHT - 6}
            className="m-line-chart__x-label"
            textAnchor="middle"
          >
            {p.day}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default LineChart;
