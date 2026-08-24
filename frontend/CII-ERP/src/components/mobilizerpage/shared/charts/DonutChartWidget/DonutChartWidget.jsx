import React from 'react';
import './DonutChartWidget.css';

const KNOWN_TONES = ['navy', 'red', 'green', 'cyan', 'orange', 'blue', 'purple', 'magenta', 'gray'];

/**
 * DonutChartWidget
 * Dependency-free SVG ring chart (stroked circle segments) with a legend.
 * Works with any number of segments.
 *
 * Props:
 *  - data: [{ label: string, value: number, tone: 'navy'|'red'|'green'|'cyan'|'orange'|'blue'|'purple'|'magenta'|'gray' | CSS color }]
 *  - size: number (px)
 *  - thickness: number (px, ring stroke width)
 *  - showLegend: boolean
 *  - showLegendValue: boolean — shows "35 New" style values before each
 *      label (default true, matching Candidate Status Distribution).
 *      Set false for a plain "Connected" / "Not Connected" legend.
 */
export default function DonutChartWidget({
  data = [],
  size = 220,
  thickness = 34,
  showLegend = true,
  showLegendValue = true,
}) {
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
    return { ...d, dash, offset };
  });

  return (
    <div className="md-donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
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
            className={isKnownTone(seg.tone) ? `md-donut__tone-${seg.tone}` : ''}
            style={isKnownTone(seg.tone) ? undefined : { stroke: seg.tone }}
          />
        ))}
      </svg>

      {showLegend && (
        <div className="md-donut__legend">
          {data.map((d, i) => (
            <div className="md-donut__legend-item" key={i}>
              <span
                className={`md-donut__swatch ${isKnownTone(d.tone) ? `md-donut__tone-bg-${d.tone}` : ''}`}
                style={isKnownTone(d.tone) ? undefined : { backgroundColor: d.tone }}
              />
              {showLegendValue && <span className="md-donut__legend-value">{d.value}</span>}
              <span className="md-donut__legend-label">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function isKnownTone(tone) {
  return KNOWN_TONES.includes(tone);
}
