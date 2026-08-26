import React from 'react';
import './BarChartWidget.css';

/**
 * BarChartWidget
 * Dependency-free SVG bar chart with solid horizontal gridlines.
 *
 * Props:
 *  - data: [{ label: string, value: number }]
 *  - yMin, yMax, yStep: number
 *  - height: number (px, viewBox height — width is fluid at 100%)
 *  - color: CSS color for the bars
 *  - barWidthRatio: 0-1
 *  - yAxisLabel: string (optional) — rotated axis title along the left edge
 */
export default function BarChartWidget({
  data = [],
  yMin = 0,
  yMax = 100,
  yStep = 20,
  height = 240,
  color = 'var(--md-navy)',
  barWidthRatio = 0.4,
  yAxisLabel,
}) {
  const width = 620;
  const padding = { top: 16, right: 16, bottom: 30, left: yAxisLabel ? 56 : 40 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const slot = plotW / data.length;
  const barW = slot * barWidthRatio;

  const yFor = (value) => padding.top + (1 - (value - yMin) / (yMax - yMin)) * plotH;

  const ticks = [];
  for (let v = yMin; v <= yMax; v += yStep) ticks.push(v);

  return (
    <svg
      className="md-barchart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Bar chart"
    >
      {ticks.map((tick) => {
        const y = yFor(tick);
        return (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="md-barchart__grid" />
            <text x={padding.left - 10} y={y + 4} className="md-barchart__ytick" textAnchor="end">
              {tick}
            </text>
          </g>
        );
      })}

      {yAxisLabel && (
        <text
          x={-(padding.top + plotH / 2)}
          y={16}
          className="md-barchart__ylabel"
          textAnchor="middle"
          transform="rotate(-90)"
        >
          {yAxisLabel}
        </text>
      )}

      {data.map((d, i) => {
        const x = padding.left + i * slot + (slot - barW) / 2;
        const y = yFor(d.value);
        const barH = padding.top + plotH - y;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={5} className="md-barchart__bar" style={{ fill: color }} />
            <text x={x + barW / 2} y={height - 10} className="md-barchart__xtick" textAnchor="middle">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
