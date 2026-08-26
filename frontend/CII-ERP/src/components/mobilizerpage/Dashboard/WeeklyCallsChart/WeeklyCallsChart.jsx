import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { BarChartWidget } from '../../shared/charts';

export default function WeeklyCallsChart({ data = [] }) {
  const yMax = getChartMax(data);

  return (
    <SectionCard title="Weekly Calls">
      <BarChartWidget
        data={data}
        yMax={yMax}
        yStep={getChartStep(yMax)}
        color="var(--md-navy)"
      />
    </SectionCard>
  );
}

function getChartMax(data) {
  return Math.max(10, ...data.map(({ value }) => value));
}

function getChartStep(yMax) {
  return Math.max(1, Math.ceil(yMax / 5));
}
