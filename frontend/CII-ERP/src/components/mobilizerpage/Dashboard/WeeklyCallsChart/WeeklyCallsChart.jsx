import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { BarChartWidget } from '../../shared/charts';
import { weeklyCallsData, weeklyCallsConfig } from '../../data/dashboardData';

export default function WeeklyCallsChart() {
  return (
    <SectionCard title="Weekly Calls">
      <BarChartWidget
        data={weeklyCallsData}
        yMin={weeklyCallsConfig.yMin}
        yMax={weeklyCallsConfig.yMax}
        yStep={weeklyCallsConfig.yStep}
        color="var(--md-navy)"
      />
    </SectionCard>
  );
}
