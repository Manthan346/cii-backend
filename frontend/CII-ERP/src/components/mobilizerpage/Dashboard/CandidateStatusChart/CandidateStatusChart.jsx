import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { DonutChartWidget } from '../../shared/charts';
import { candidateStatusData } from '../../data/dashboardData';
import './CandidateStatusChart.css';

export default function CandidateStatusChart() {
  return (
    <SectionCard title="Candidate Status Distribution">
      <div className="md-candidate-status__center">
        <DonutChartWidget data={candidateStatusData} />
      </div>
    </SectionCard>
  );
}
