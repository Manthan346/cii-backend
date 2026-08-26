import React from 'react';
import SectionCard from '../../../shared/SectionCard/SectionCard';
import { BarChartWidget } from '../../../shared/charts';
import { qualificationData, qualificationConfig } from '../../../data/placementDashboardData';

export default function QualificationChart() {
  return (
    <SectionCard title="Qualification Distribution">
      <BarChartWidget
        data={qualificationData}
        yMin={qualificationConfig.yMin}
        yMax={qualificationConfig.yMax}
        yStep={qualificationConfig.yStep}
      />
    </SectionCard>
  );
}
