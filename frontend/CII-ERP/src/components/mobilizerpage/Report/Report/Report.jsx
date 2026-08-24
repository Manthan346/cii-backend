import React from 'react';
import ReportFilterBar from '../ReportFilterBar/ReportFilterBar';
import ContactStatusReport from '../ContactStatusReport/ContactStatusReport';
import EnrollmentReport from '../EnrollmentReport/EnrollmentReport';
import AdmissionDoneReport from '../AdmissionDoneReport/AdmissionDoneReport';
import './Report.css';

/**
 * Report
 * Two rows, each an independent flex row (same reasoning as the
 * Dashboard rebuild — keeps one row's card heights from ever affecting
 * another row's spacing):
 *   Row 1: Contact Status Report | Enrollment Report
 *   Row 2: Admission Done report (full width, single card)
 */
export default function Report() {
  return (
    <div className="report-page">
      <div className="rp-header">
        <h1 className="rp-header__title">Reports</h1>
        <p className="rp-header__subtitle">
          All reports including enrollment, connected candidate and admission done
        </p>
      </div>

      <ReportFilterBar
        onApply={(range) => console.log('Apply filter', range)}
        onExport={() => console.log('Export')}
      />

      <div className="rp-row">
        <ContactStatusReport />
        <EnrollmentReport />
      </div>

      <div className="rp-row">
        <AdmissionDoneReport />
      </div>
    </div>
  );
}
