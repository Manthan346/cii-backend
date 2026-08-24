import React from 'react';
import './DonutChart.css';

/**
 * DonutChart
 * A dependency-free SVG ring chart built from stroked circle segments,
 * plus an optional legend row — matches the "Placement statistics" panel.
 *
 * Props:
 *  - data: [{ label: string, value: number, tone: 'blue' | 'black' | 'gray' | string }]
 *      `tone` maps to a .ra-donut__tone-<tone> CSS class (see DonutChart.css).
 *      Pass a plain CSS color string instead if you need a one-off color.
 *  - size: number (px, both width and height of the SVG)
 *  - thickness: number (px, ring stroke width)
 *  - showLegend: boolean
 */
export default function DonutChart({ data = [], size = 220, thickness = 34, showLegend = true }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const segments = data.map((d) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const offset = cumulative * circumference;
    cumulative += fraction;
    return { ...d, dash, offset, fraction };
  });

  return (
    <div className="ra-donut">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Donut chart"
      >
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            strokeWidth={thickness}
            strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
            strokeDashoffset={-seg.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            className={isKnownTone(seg.tone) ? `ra-donut__tone-${seg.tone}` : ''}
            style={isKnownTone(seg.tone) ? undefined : { stroke: seg.tone }}
          />
        ))}
      </svg>

      {showLegend && (
        <div className="ra-donut__legend">
          {data.map((d, i) => (
            <div className="ra-donut__legend-item" key={i}>
              <span
                className={`ra-donut__swatch ${isKnownTone(d.tone) ? `ra-donut__tone-bg-${d.tone}` : ''}`}
                style={isKnownTone(d.tone) ? undefined : { backgroundColor: d.tone }}
              />
              <span className="ra-donut__legend-label">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function isKnownTone(tone) {
  return ['blue', 'black', 'gray'].includes(tone);
}
