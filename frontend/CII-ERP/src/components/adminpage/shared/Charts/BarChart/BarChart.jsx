import React from 'react';
import './BarChart.css';

/**
 * BarChart
 * A dependency-free SVG bar chart with solid horizontal gridlines.
 * Used by both "Course-wise enrollment" and "Monthly admissions".
 *
 * Props:
 *  - data: [{ label: string | string[], value: number }]
 *      Pass label as an array (e.g. ['Artificial', 'intelligence']) to
 *      render it as a wrapped two-line x-axis label.
 *  - yMin, yMax, yStep: number
 *  - height: number (px, viewBox height — width is fluid at 100%)
 *  - color: CSS color for the bars
 *  - barWidthRatio: 0-1, how much of each column's slot the bar fills
 */
export default function BarChart({
  data = [],
  yMin = 0,
  yMax = 100,
  yStep = 20,
  height = 260,
  color = 'var(--ra-blue)',
  barWidthRatio = 0.42,
}) {
  const width = 640;
  const padding = { top: 16, right: 16, bottom: 40, left: 40 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const slot = plotW / data.length;
  const barW = slot * barWidthRatio;

  const yFor = (value) =>
    padding.top + (1 - (value - yMin) / (yMax - yMin)) * plotH;

  const ticks = [];
  for (let v = yMin; v <= yMax; v += yStep) ticks.push(v);

  return (
    <svg
      className="ra-barchart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Bar chart"
    >
      {/* solid horizontal gridlines + y-axis labels */}
      {ticks.map((tick) => {
        const y = yFor(tick);
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              className="ra-barchart__grid"
            />
            <text x={padding.left - 10} y={y + 4} className="ra-barchart__ytick" textAnchor="end">
              {tick}
            </text>
          </g>
        );
      })}

      {/* bars */}
      {data.map((d, i) => {
        const x = padding.left + i * slot + (slot - barW) / 2;
        const y = yFor(d.value);
        const barH = padding.top + plotH - y;
        const lines = Array.isArray(d.label) ? d.label : [d.label];

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={6}
              className="ra-barchart__bar"
              style={{ fill: color }}
            />
            {lines.map((line, li) => (
              <text
                key={li}
                x={x + barW / 2}
                y={height - 24 + li * 14}
                className="ra-barchart__xtick"
                textAnchor="middle"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
