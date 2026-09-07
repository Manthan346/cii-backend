import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { DonutChartWidget } from '../../shared/charts';
import './ContactStatusReport.css';

export default function ContactStatusReport({ data = [], unavailable = false }) {
  return (
    <SectionCard
      title="Contact Status Report"
      subtitle="Shown how many enquiries were successfully contacted vs not contacted"
    >
      {unavailable ? <ReportUnavailable /> : (
        <div className="rp-contact-status__center">
          <DonutChartWidget data={data} showLegendValue={false} />
        </div>
      )}
    </SectionCard>
  );
}

function ReportUnavailable() {
  return <p className="rp-report-unavailable">Report data endpoint is not available.</p>;
}
