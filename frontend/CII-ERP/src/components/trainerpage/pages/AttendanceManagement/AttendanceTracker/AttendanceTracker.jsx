import { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  XSquare,
  RefreshCw,
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import { Dropdown, Button, Pagination } from '../../../shared';
import StatCard from '../StatCard/StatCard';
import AttendanceTable from '../AttendanceTable/AttendanceTable';
import MarkAttendanceModal from '../MarkAttendanceModal/MarkAttendanceModal';
import {
  attendanceStats,
  attendanceMeta,
  attendanceRecords as defaultRecords,
  batchOptions,
  attendanceStatusOptions,
  candidates as students,
} from '../../../data';
import './AttendanceTracker.css';

/**
 * AttendanceTracker
 *
 * Trainer "Attendance tracker" view - matches the reference screens:
 *  - 4 summary stat cards (Sessions today / Present / Absent / Avg. attendance)
 *  - Search / Batch / Date / Status filter bar with an Apply Filter action
 *  - "Today's Attendance" table (export buttons removed per request)
 *  - "+ Mark attendance" button that opens a popup listing every student
 *    with a Present/Absent toggle (defaults to Present); saving it
 *    prepends the marked rows to the table and shows a success toast
 *
 * Data (stats + table rows + page meta) comes from data/attendanceData.js
 * so it can be swapped for an API response later without touching this file.
 */
const STAT_ICONS = {
  calendar: Calendar,
  check: CheckSquare,
  close: XSquare,
  refresh: RefreshCw,
};
export default function AttendanceTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [batch, setBatch] = useState(batchOptions[0]);
  const [date, setDate] = useState('08-07-26');
  const [status, setStatus] = useState(attendanceStatusOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState(defaultRecords);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const handleSaveAttendance = ({ attendanceList }) => {
    const newRecords = attendanceList.map((entry) => ({
      id: `${entry.id}-${Date.now()}`,
      candidateId: entry.candidateId,
      name: entry.name,
      batch: entry.batch,
      course: entry.course,
      progress: 0,
      timeIn: entry.status === 'Absent' ? '—' : '9:00',
      timeOut: entry.status === 'Absent' ? '—' : '5:00',
      status: entry.status,
    }));
    setRecords((prev) => [...newRecords, ...prev]);
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };
  return (
    <div className={'attendance-management-attendance-tracker-content'}>
      {showToast && (
        <div
          className={'attendance-management-attendance-tracker-toast'}
          role="status"
        >
          Attendance saved successfully
        </div>
      )}

      <div className={'attendance-management-attendance-tracker-page-header'}>
        <div>
          <h1 className={'attendance-management-attendance-tracker-title'}>
            Attendance tracker
          </h1>
          <p className={'attendance-management-attendance-tracker-subtitle'}>
            Track daily attendance across {attendanceMeta.totalActiveBatches}{' '}
            active batches
          </p>
        </div>
        <div
          className={'attendance-management-attendance-tracker-header-actions'}
        >
          <Button
            variant="primary"
            icon={Plus}
            iconPosition="left"
            onClick={() => setShowModal(true)}
          >
            Mark attendance
          </Button>
        </div>
      </div>

      <div className={'attendance-management-attendance-tracker-stats-grid'}>
        {attendanceStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={STAT_ICONS[stat.icon]}
            value={stat.value}
            label={stat.label}
            tone={stat.tone}
          />
        ))}
      </div>

      <div className={'attendance-management-attendance-tracker-filter-bar'}>
        <div
          className={'attendance-management-attendance-tracker-search-field'}
        >
          <label
            className={'attendance-management-attendance-tracker-filter-label'}
          >
            SEARCH
          </label>
          <div
            className={
              'attendance-management-attendance-tracker-search-input-wrap'
            }
          >
            <Search
              size={16}
              className={'attendance-management-attendance-tracker-search-icon'}
            />
            <input
              type="text"
              placeholder="Search by name & ID"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={
                'attendance-management-attendance-tracker-search-input'
              }
            />
          </div>
        </div>

        <Dropdown
          label="BATCH"
          options={batchOptions}
          value={batch}
          onChange={setBatch}
        />

        <div className={'attendance-management-attendance-tracker-date-field'}>
          <label
            className={'attendance-management-attendance-tracker-filter-label'}
          >
            DATE
          </label>
          <input
            type="text"
            className={'attendance-management-attendance-tracker-date-input'}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <Dropdown
          label="STATUS"
          options={attendanceStatusOptions}
          value={status}
          onChange={setStatus}
        />

        <div className={'attendance-management-attendance-tracker-apply-wrap'}>
          <Button variant="outline" icon={Filter}>
            Apply Filter
          </Button>
        </div>
      </div>

      <section
        className={'attendance-management-attendance-tracker-table-section'}
      >
        <div
          className={'attendance-management-attendance-tracker-table-header'}
        >
          <h2
            className={'attendance-management-attendance-tracker-table-title'}
          >
            Today's Attendance{' '}
            <span
              className={'attendance-management-attendance-tracker-table-date'}
            >
              . {attendanceMeta.attendanceDate}
            </span>
          </h2>
        </div>

        <AttendanceTable records={records} />

        <Pagination
          showing={records.length}
          total={attendanceMeta.totalRecords}
          currentPage={currentPage}
          totalPages={attendanceMeta.totalPages}
          onPageChange={setCurrentPage}
          label={`Showing ${records.length} batches out of ${attendanceMeta.totalRecords}`}
        />
      </section>

      {showModal && (
        <MarkAttendanceModal
          students={students}
          defaultDate={date}
          onCancel={() => setShowModal(false)}
          onSave={handleSaveAttendance}
        />
      )}
    </div>
  );
}
