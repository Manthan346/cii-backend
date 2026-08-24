import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';
import './BarChartCard.css';

/**
 * BarChartCard (shared)
 *
 * Reusable bar-chart card: a title, a bar chart, and a black rounded
 * "pill" value label floating above each bar. Fully data-driven -
 * doesn't know or care what domain it's charting, so it can back the
 * Dashboard's "Applications per job" chart today and, e.g., a Job
 * Management "Openings by department" chart later without changes.
 *
 * Props:
 *  - title: string                 -> card heading
 *  - data: array                   -> one object per bar
 *  - xKey: string                  -> key in each data object used as the x-axis category
 *  - valueKey: string (default 'value') -> key in each data object used as the bar's value
 *  - barColor: string (default '#6a6ff0')
 *  - height: number (default 280)  -> chart height in px
 *  - yDomain: [min, max] (default [0, 100])
 *  - yTicks: number[] (default [0, 20, 40, 60, 80, 100])
 */
const PillLabel = (props) => {
  const { x, y, width, value } = props;
  const pillWidth = 30;
  const pillHeight = 22;
  const cx = x + width / 2;

  return (
    <g>
      <rect
        x={cx - pillWidth / 2}
        y={y - pillHeight - 8}
        width={pillWidth}
        height={pillHeight}
        rx={pillHeight / 2}
        fill="#1c1f2e"
      />
      <text
        x={cx}
        y={y - pillHeight / 2 - 8}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize={12}
        fontWeight={700}
      >
        {value}
      </text>
    </g>
  );
};

const BarChartCard = ({
  title,
  data,
  xKey,
  valueKey = 'value',
  barColor = '#6a6ff0',
  height = 280,
  yDomain = [0, 100],
  yTicks = [0, 20, 40, 60, 80, 100],
}) => {
  return (
    <div className="bar-chart-card">
      <h3 className="bar-chart-card__title">{title}</h3>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 34, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eef1f7" />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#4b5164', fontWeight: 600 }}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={yDomain}
            ticks={yTicks}
            tick={{ fontSize: 12, fill: '#9aa1b1' }}
          />
          <Bar dataKey={valueKey} fill={barColor} radius={[6, 6, 0, 0]} barSize={42}>
            <LabelList dataKey={valueKey} content={<PillLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCard;
