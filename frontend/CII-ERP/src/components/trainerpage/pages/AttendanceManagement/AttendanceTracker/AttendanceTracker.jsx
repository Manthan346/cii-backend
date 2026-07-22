import { useState } from "react";
import {
  Calendar,
  CheckSquare,
  XSquare,
  RefreshCw,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { Dropdown, Button, Pagination } from "../../../shared";
import StatCard from "../StatCard/StatCard";
import AttendanceTable from "../AttendanceTable/AttendanceTable";
import MarkAttendanceModal from "../MarkAttendanceModal/MarkAttendanceModal";
import {
  attendanceStats,
  attendanceMeta,
  attendanceRecords as defaultRecords,
  batchOptions,
  attendanceStatusOptions,
} from "../../../data";
import styles from "./AttendanceTracker.module.css";

/**
 * AttendanceTracker
 *
 * Staff "Attendance tracker" view - matches the reference screens:
 *  - 4 summary stat cards (Sessions today / Present / Absent / Avg. attendance)
 *  - Search / Batch / Date / Status filter bar with an Apply Filter action
 *  - "Today's Attendance" table with Export CSV / Export Excel
 *  - "+ Mark attendance" button that opens a popup form; saving it
 *    prepends a new row to the table and shows a success toast
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
  const [searchTerm, setSearchTerm] = useState("");
  const [batch, setBatch] = useState(batchOptions[0]);
  const [date, setDate] = useState("08-07-26");
  const [status, setStatus] = useState(attendanceStatusOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState(defaultRecords);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSaveAttendance = ({ batchName, date: markedDate, candidate, status: markedStatus }) => {
    const newRecord = {
      id: Date.now(),
      candidateId: "CII-DS-1042",
      name: candidate || "New candidate",
      batch: batchName || "—",
      course: "—",
      progress: 0,
      timeIn: markedStatus === "Absent" ? "—" : "9:00",
      timeOut: markedStatus === "Absent" ? "—" : "5:00",
      status: markedStatus,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className={styles.content}>
      {showToast && (
        <div className={styles.toast} role="status">
          Attendance saved successfully
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Attendance tracker</h1>
          <p className={styles.subtitle}>
            Track daily attendance across {attendanceMeta.totalActiveBatches} active batches
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline">Export</Button>
          <Button variant="primary" icon={Plus} iconPosition="left" onClick={() => setShowModal(true)}>
            Mark attendance
          </Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
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

      <div className={styles.filterBar}>
        <div className={styles.searchField}>
          <label className={styles.filterLabel}>SEARCH</label>
          <div className={styles.searchInputWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name & ID"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <Dropdown label="BATCH" options={batchOptions} value={batch} onChange={setBatch} />

        <div className={styles.dateField}>
          <label className={styles.filterLabel}>DATE</label>
          <input
            type="text"
            className={styles.dateInput}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <Dropdown label="STATUS" options={attendanceStatusOptions} value={status} onChange={setStatus} />

        <div className={styles.applyWrap}>
          <Button variant="outline" icon={Filter}>
            Apply Filter
          </Button>
        </div>
      </div>

      <section className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            Today's Attendance <span className={styles.tableDate}>. {attendanceMeta.attendanceDate}</span>
          </h2>
          <div className={styles.tableActions}>
            <Button variant="outline">Export CSV</Button>
            <Button variant="outline">Export Excel</Button>
          </div>
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
          defaultDate={date}
          onCancel={() => setShowModal(false)}
          onSave={handleSaveAttendance}
        />
      )}
    </div>
  );
}
