import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { DonutChartWidget } from '../../shared/charts';
import { contactStatusData } from '../../data/reportData';
import './ContactStatusReport.css';

export default function ContactStatusReport() {
  return (
    <SectionCard
      title="Contact Status Report"
      subtitle="Shown how many enquiries were successfully contacted vs not contacted"
    >
      <div className="rp-contact-status__center">
        <DonutChartWidget data={contactStatusData} showLegendValue={false} />
      </div>
    </SectionCard>
  );
}
