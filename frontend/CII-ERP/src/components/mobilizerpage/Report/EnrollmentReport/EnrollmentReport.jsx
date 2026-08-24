import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { BarChartWidget } from '../../shared/charts';
import { enrollmentReportData, enrollmentReportConfig } from '../../data/reportData';

export default function EnrollmentReport() {
  return (
    <SectionCard title="Enrollment Report" subtitle="Shown how many candidates got enrolled each month">
      <BarChartWidget
        data={enrollmentReportData}
        yMin={enrollmentReportConfig.yMin}
        yMax={enrollmentReportConfig.yMax}
        yStep={enrollmentReportConfig.yStep}
        yAxisLabel="No. of enrollment"
      />
    </SectionCard>
  );
}
