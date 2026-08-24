import React from 'react';
import { Printer, FileSpreadsheet, FileText } from 'lucide-react';
import ReportsFilterBar from '../ReportsFilterBar/ReportsFilterBar';
import { LineChart, DonutChart, BarChart } from '../../../shared/Charts';
import {
  candidateGrowthData,
  candidateGrowthConfig,
  placementStatsData,
  courseEnrollmentData,
  courseEnrollmentConfig,
  monthlyAdmissionsData,
  monthlyAdmissionsConfig,
  reportsCourseOptions,
} from '../../../data/reportsAnalyticsData';
import './ReportsAnalytics.css';

export default function ReportsAnalytics() {
  const handleApplyFilters = (filters) => {
    // Wire this up to your data-fetching layer once the API is ready —
    // filters = { from, to, course }
    console.log('Apply filters', filters);
  };

  const handlePrint = () => window.print();

  const handleExportExcel = () => {
    // Hook up to your export endpoint / xlsx generation utility.
    console.log('Export Excel');
  };

  const handleExportPdf = () => {
    // Hook up to your export endpoint / pdf generation utility.
    console.log('Export PDF');
  };

  return (
    <div className="reports-analytics">
      <div className="ra-header">
        <div className="ra-header__text">
          <h1 className="ra-header__title">Reports &amp; analytics</h1>
          <p className="ra-header__subtitle">
            Institution-wide performance across centers and courses
          </p>
        </div>

        <div className="ra-header__actions">
          <button type="button" className="ra-btn ra-btn--outline" onClick={handlePrint}>
            <Printer size={16} />
            Print
          </button>
          <button type="button" className="ra-btn ra-btn--outline" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
          <button type="button" className="ra-btn ra-btn--primary" onClick={handleExportPdf}>
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <ReportsFilterBar courseOptions={reportsCourseOptions} onApply={handleApplyFilters} />

      <div className="ra-grid">
        <section className="ra-card">
          <h2 className="ra-card__title">Candidate growth — 6 months</h2>
          <LineChart
            data={candidateGrowthData}
            yMin={candidateGrowthConfig.yMin}
            yMax={candidateGrowthConfig.yMax}
            yStep={candidateGrowthConfig.yStep}
          />
        </section>

        <section className="ra-card">
          <h2 className="ra-card__title">Placement statistics</h2>
          <div className="ra-card__center">
            <DonutChart data={placementStatsData} />
          </div>
        </section>

        <section className="ra-card">
          <h2 className="ra-card__title">Course-wise enrollment</h2>
          <BarChart
            data={courseEnrollmentData}
            yMin={courseEnrollmentConfig.yMin}
            yMax={courseEnrollmentConfig.yMax}
            yStep={courseEnrollmentConfig.yStep}
          />
        </section>

        <section className="ra-card">
          <h2 className="ra-card__title">Monthly admissions</h2>
          <BarChart
            data={monthlyAdmissionsData}
            yMin={monthlyAdmissionsConfig.yMin}
            yMax={monthlyAdmissionsConfig.yMax}
            yStep={monthlyAdmissionsConfig.yStep}
          />
        </section>
      </div>
    </div>
  );
}
