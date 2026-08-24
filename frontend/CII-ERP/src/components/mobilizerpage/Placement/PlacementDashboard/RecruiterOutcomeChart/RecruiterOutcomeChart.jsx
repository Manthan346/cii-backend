import React from 'react';
import SectionCard from '../../../shared/SectionCard/SectionCard';
import { BarChartWidget } from '../../../shared/charts';
import { recruiterOutcomeData, recruiterOutcomeConfig } from '../../../data/placementDashboardData';

export default function RecruiterOutcomeChart() {
  return (
    <SectionCard title="Recruiter Outcome Distribution">
      <BarChartWidget
        data={recruiterOutcomeData}
        yMin={recruiterOutcomeConfig.yMin}
        yMax={recruiterOutcomeConfig.yMax}
        yStep={recruiterOutcomeConfig.yStep}
        color="#d1911f"
      />
    </SectionCard>
  );
}
