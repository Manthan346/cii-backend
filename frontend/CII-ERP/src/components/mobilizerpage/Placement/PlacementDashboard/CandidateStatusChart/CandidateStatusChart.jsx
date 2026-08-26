import React from 'react';
import SectionCard from '../../../shared/SectionCard/SectionCard';
import { DonutChartWidget } from '../../../shared/charts';
import { candidateStatusData } from '../../../data/placementDashboardData';
import './CandidateStatusChart.css';

export default function CandidateStatusChart() {
  return (
    <SectionCard title="Candidate Status Distribution">
      <div className="pd-donut__center">
        <DonutChartWidget data={candidateStatusData} showLegendValue={false} />
      </div>
    </SectionCard>
  );
}
