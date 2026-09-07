import React from 'react';
import { Sigma, BarChart3 } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import { BarChartWidget } from '../../shared/charts';
import './AdmissionDoneReport.css';

const ICON_MAP = { Sigma, BarChart3 };

export default function AdmissionDoneReport({ data = [], config = {}, summary = [], unavailable = false }) {
  return (
    <SectionCard
      title="Admission Done report"
      subtitle="Shown how many enrolled candidates completed their admission each month"
    >
      <div className="rp-admission">
        <div className="rp-admission__chart">
          {unavailable ? <p className="rp-report-unavailable">Report data endpoint is not available.</p> : (
            <BarChartWidget
              data={data}
              yMin={config.yMin ?? 0}
              yMax={config.yMax ?? 100}
              yStep={config.yStep ?? 20}
              yAxisLabel="No. of Admission"
            />
          )}
        </div>

        <div className="rp-admission__divider" />

        <div className="rp-admission__stats">
          {summary.map((stat) => {
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
