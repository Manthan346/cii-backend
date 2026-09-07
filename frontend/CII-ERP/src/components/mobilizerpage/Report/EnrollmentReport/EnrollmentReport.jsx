import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { BarChartWidget } from '../../shared/charts';

export default function EnrollmentReport({ data = [], config = {}, unavailable = false }) {
  return (
    <SectionCard title="Enrollment Report" subtitle="Shown how many candidates got enrolled each month">
      {unavailable ? <p className="rp-report-unavailable">Report data endpoint is not available.</p> : (
        <BarChartWidget
          data={data}
          yMin={config.yMin ?? 0}
          yMax={config.yMax ?? 100}
          yStep={config.yStep ?? 20}
          yAxisLabel="No. of enrollment"
        />
      )}
    </SectionCard>
  );
}
