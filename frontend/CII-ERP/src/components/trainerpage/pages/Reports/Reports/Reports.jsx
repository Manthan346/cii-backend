import React, { useState } from 'react';
import {
  LayoutGrid,
  Clock,
  FileText,
  TrendingUp,
  Download,
  Printer,
  Plus,
} from 'lucide-react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import { Dropdown, Button, Pagination } from '../../../shared';
import StatCard from '../StatCard/StatCard';
import AttendanceOverview from '../AttendanceOverview/AttendanceOverview';
import ReportTable from '../ReportTable/ReportTable';
import GenerateReportModal from '../GenerateReportModal/GenerateReportModal';
import {
  reportStats,
  attendanceOverviewByBatch,
  attendanceOverviewMeta,
  reportTypeOptions,
  reportBatchOptions,
  reportFormatOptions,
  reportMeta,
  reportRecords as defaultRecords,
} from '../../../data';
import '../../../styles/variables.css';
import './Reports.css';

/**
 * Reports
 *
 * Staff "Reports" page. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page) around the
 * page-specific content: summary stat cards, the "Attendance overview
 * by batch" panel, a Report type/Batch/From/To filter bar, the "All
 * reports" table, and a pagination footer - matches the reference
 * "Reports" screens.
 *
 * The "+ Generate report" button opens GenerateReportModal; saving it
 * prepends a new row to the table and shows the success toast.
 */
const STAT_ICONS = {
  grid: LayoutGrid,
  clock: Clock,
  file: FileText,
  trend: TrendingUp,
};

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [reportType, setReportType] = useState(reportTypeOptions[0]);
  const [batch, setBatch] = useState(reportBatchOptions[0]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState(defaultRecords);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleApplyFilter = () => {
    // No real backend here - filter values are captured and ready to
    // be wired to a GET /api/reports?type=&batch=&from=&to= call.
  };

  const handleGenerateReport = ({
    reportType: type,
    batch: reportBatch,
    format,
    from,
    to,
  }) => {
    const newRecord = {
      id: Date.now(),
      name: `${type || 'New'} report${from ? ` - ${from}` : ''}`,
      type: type || 'Attendance',
      batch: reportBatch || 'All batches',
      generatedOn: 'Today',
      generatedBy: 'Staff Admin',
      format: format || 'PDF',
    };

    setRecords((prev) => [newRecord, ...prev]);
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: 'Staff Admin' }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="reports-page">
              {showToast && (
                <div className="reports-page__toast" role="status">
                  report generated successfully
                </div>
              )}

              <div className="reports-page__header">
                <div>
                  <h1 className="reports-page__title">Reports</h1>
                  <p className="reports-page__subtitle">
                    {reportMeta.totalReports} report generated across
                    attendance,performance and batches
                  </p>
                </div>
                <Button
                  variant="primary"
                  icon={Plus}
                  iconPosition="left"
                  onClick={() => setShowModal(true)}
                >
                  Generate report
                </Button>
              </div>

              <div className="reports-page__stats-grid">
                {reportStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    icon={STAT_ICONS[stat.icon]}
                    value={stat.value}
                    label={stat.label}
                    tone={stat.tone}
                  />
                ))}
              </div>

              <AttendanceOverview
                title={attendanceOverviewMeta.title}
                rows={attendanceOverviewByBatch}
              />

              <div className="reports-page__filter-bar">
                <Dropdown
                  label="Report type"
                  options={reportTypeOptions}
                  value={reportType}
                  onChange={setReportType}
                />
                <Dropdown
                  label="Batch"
                  options={reportBatchOptions}
                  value={batch}
                  onChange={setBatch}
                />
                <div className="reports-page__filter-field">
                  <label className="reports-page__filter-label">From</label>
                  <input
                    type="date"
                    className="reports-page__filter-input"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                  />
                </div>
                <div className="reports-page__filter-field">
                  <label className="reports-page__filter-label">To</label>
                  <input
                    type="date"
                    className="reports-page__filter-input"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                  />
                </div>
                <div className="reports-page__filter-apply">
                  <Button variant="outline" onClick={handleApplyFilter}>
                    Apply Filter
                  </Button>
                </div>
              </div>

              <section className="reports-page__table-section">
                <div className="reports-page__table-header">
                  <h2 className="reports-page__table-title">All reports</h2>
                  <div className="reports-page__table-actions">
                    <button
                      type="button"
                      className="reports-page__icon-btn"
                      aria-label="Download list"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      type="button"
                      className="reports-page__icon-btn"
                      aria-label="Print list"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>

                <ReportTable records={records} />

                <Pagination
                  showing={records.length}
                  total={reportMeta.totalReports}
                  currentPage={currentPage}
                  totalPages={reportMeta.totalPages}
                  onPageChange={setCurrentPage}
                  label={`Showing 1-${records.length} out of ${reportMeta.totalReports}`}
                />
              </section>
            </div>
          </main>
        </div>
      </div>

      {showModal && (
        <GenerateReportModal
          reportTypeOptions={reportTypeOptions}
          batchOptions={reportBatchOptions}
          formatOptions={reportFormatOptions}
          onCancel={() => setShowModal(false)}
          onGenerate={handleGenerateReport}
        />
      )}
    </div>
  );
};

export default Reports;
