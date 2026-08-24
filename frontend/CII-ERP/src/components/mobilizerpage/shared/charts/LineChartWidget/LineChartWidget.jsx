import React from 'react';
import './LineChartWidget.css';

/**
 * LineChartWidget
 * Dependency-free SVG line chart with a smooth (Catmull-Rom) curve,
 * dashed horizontal gridlines, and dot markers.
 *
 * Props:
 *  - data: [{ label: string, value: number }]
 *  - yMin, yMax, yStep: number
 *  - height: number (px, viewBox height — width is fluid at 100%)
 *  - color: CSS color for the line/dots
 */
export default function LineChartWidget({
  data = [],
  yMin = 0,
  yMax = 100,
  yStep = 20,
  height = 240,
  color = 'var(--md-blue)',
}) {
  const width = 620;
  const padding = { top: 16, right: 16, bottom: 28, left: 40 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const xFor = (i) =>
    padding.left + (data.length === 1 ? 0 : (i / (data.length - 1)) * plotW);
  const yFor = (value) =>
    padding.top + (1 - (value - yMin) / (yMax - yMin)) * plotH;

  const points = data.map((d, i) => ({ x: xFor(i), y: yFor(d.value), ...d }));
  const linePath = getSmoothPath(points);

  const ticks = [];
  for (let v = yMin; v <= yMax; v += yStep) ticks.push(v);

  return (
    <svg
      className="md-linechart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Line chart"
    >
      {ticks.map((tick) => {
        const y = yFor(tick);
        return (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="md-linechart__grid" />
            <text x={padding.left - 10} y={y + 4} className="md-linechart__ytick" textAnchor="end">
              {tick}
            </text>
          </g>
        );
      })}

      <path d={linePath} className="md-linechart__line" style={{ stroke: color }} />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5} className="md-linechart__dot" style={{ fill: color }} />
      ))}

      {points.map((p, i) => (
        <text key={i} x={p.x} y={height - 8} className="md-linechart__xtick" textAnchor="middle">
          {p.label}
        </text>
      ))}
    </svg>
  );
}

function getSmoothPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}
