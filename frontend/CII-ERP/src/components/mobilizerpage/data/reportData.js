// Data for the Report page.

export const contactStatusData = [
  { label: 'Connected', value: 75, tone: 'navy' },
  { label: 'Not Connected', value: 25, tone: 'cyan' },
];

export const enrollmentReportData = [
  { label: 'May', value: 72 },
  { label: 'Jun', value: 57 },
  { label: 'July', value: 33 },
  { label: 'Aug', value: 83 },
  { label: 'Sep', value: 13 },
];

export const enrollmentReportConfig = { yMin: 0, yMax: 90, yStep: 10 };

// These 5 monthly values intentionally sum to 148 and peak at 79 in
// August — matching the "Total Admission Completed" and "Highest
// Admission -August" tiles below exactly, since both describe the same
// May-Sep window shown in this same chart (unlike the Dashboard's
// separate aggregate-vs-sample-data KPIs, there's no larger hidden
// dataset here to justify a mismatch).
export const admissionReportData = [
  { label: 'May', value: 22 },
  { label: 'Jun', value: 28 },
  { label: 'July', value: 13 },
  { label: 'Aug', value: 79 },
  { label: 'Sep', value: 6 },
];

export const admissionReportConfig = { yMin: 0, yMax: 90, yStep: 10 };

export const admissionSummaryStats = [
  { id: 'total', icon: 'Sigma', value: 148, label: 'Total Admission Completed' },
  { id: 'highest', icon: 'BarChart3', value: 79, label: 'Highest Admission', sublabel: '-August' },
];
