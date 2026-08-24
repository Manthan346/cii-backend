import React from 'react';
import { Sigma, BarChart3 } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { BarChartWidget } from '../../shared/charts';
import { admissionReportData, admissionReportConfig, admissionSummaryStats } from '../../data/reportData';
import './AdmissionDoneReport.css';

const ICON_MAP = { Sigma, BarChart3 };

export default function AdmissionDoneReport() {
  return (
    <SectionCard
      title="Admission Done report"
      subtitle="Shown how many enrolled candidates completed their admission each month"
    >
      <div className="rp-admission">
        <div className="rp-admission__chart">
          <BarChartWidget
            data={admissionReportData}
            yMin={admissionReportConfig.yMin}
            yMax={admissionReportConfig.yMax}
            yStep={admissionReportConfig.yStep}
            yAxisLabel="No. of Admission"
          />
        </div>

        <div className="rp-admission__divider" />

        <div className="rp-admission__stats">
          {admissionSummaryStats.map((stat) => {
            const Icon = ICON_MAP[stat.icon];
            return (
              <div className="rp-summary-tile" key={stat.id}>
                <span className="rp-summary-tile__icon">
                  <Icon size={18} />
                </span>
                <span className="rp-summary-tile__value">{stat.value}</span>
                <span className="rp-summary-tile__label">
                  {stat.label}
                  {stat.sublabel && (
                    <>
                      <br />
                      {stat.sublabel}
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
