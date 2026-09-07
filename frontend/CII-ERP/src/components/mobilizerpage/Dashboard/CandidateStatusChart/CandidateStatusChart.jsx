import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { DonutChartWidget } from '../../shared/charts';
import './CandidateStatusChart.css';

export default function CandidateStatusChart({ data = [] }) {
  return (
    <SectionCard title="Candidate Status Distribution">
      <div className="md-candidate-status__center">
        <DonutChartWidget data={data} />
      </div>
    </SectionCard>
  );
}
