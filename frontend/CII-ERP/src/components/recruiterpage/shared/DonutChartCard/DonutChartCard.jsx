import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './DonutChartCard.css';

/**
 * DonutChartCard (shared)
 *
 * Reusable donut chart + colored-badge legend. Fully data-driven -
 * each data item just needs a label, a value, and a color, whatever
 * those fields are named in the source data (see the *Key props).
 * Backs the Dashboard's "Applications by status" chart today and can
 * back any other status/category breakdown later without changes.
 *
 * Props:
 *  - title: string
 *  - data: array                     -> one object per slice/legend row
 *  - labelKey: string                -> key used as the slice/legend label
 *  - valueKey: string (default 'value')
 *  - colorKey: string (default 'color')
 *  - legendColumns: number (default 3)
 *  - height: number (default 220)    -> donut height in px
 */
const DonutChartCard = ({
  title,
  data,
  labelKey,
  valueKey = 'value',
  colorKey = 'color',
  legendColumns = 3,
  height = 220,
}) => {
  return (
    <div className="donut-chart-card">
      <h3 className="donut-chart-card__title">{title}</h3>

      <div className="donut-chart-card__donut">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={labelKey}
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry[labelKey] ?? index} fill={entry[colorKey]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul
        className="donut-chart-card__legend"
        style={{ gridTemplateColumns: `repeat(${legendColumns}, 1fr)` }}
      >
        {data.map((entry, index) => (
          <li key={entry[labelKey] ?? index} className="donut-chart-card__legend-item">
            <span
              className="donut-chart-card__legend-badge"
              style={{ backgroundColor: entry[colorKey] }}
            >
              {entry[valueKey]}
            </span>
            <span className="donut-chart-card__legend-label">{entry[labelKey]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonutChartCard;
