import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { LineChartWidget } from '../../shared/charts';

export default function DailyEnrollmentsChart({ data = [] }) {
  const yMax = getChartMax(data);

  return (
    <SectionCard title="Weekly Enrollments">
      <LineChartWidget
        data={data}
        yMax={yMax}
        yStep={getChartStep(yMax)}
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
