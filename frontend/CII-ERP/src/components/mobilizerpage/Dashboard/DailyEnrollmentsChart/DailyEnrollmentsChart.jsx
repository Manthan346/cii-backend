import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { LineChartWidget } from '../../shared/charts';
import { dailyEnrollmentsData, dailyEnrollmentsConfig } from '../../data/dashboardData';

export default function DailyEnrollmentsChart() {
  return (
    <SectionCard title="Daily Enrollments">
      <LineChartWidget
        data={dailyEnrollmentsData}
        yMin={dailyEnrollmentsConfig.yMin}
        yMax={dailyEnrollmentsConfig.yMax}
        yStep={dailyEnrollmentsConfig.yStep}
      />
    </SectionCard>
  );
}
