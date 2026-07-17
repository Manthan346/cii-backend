import { UserCircle2 } from "lucide-react";
import { StatusBadge, ProgressBar, ActionButtons } from "../../../shared";
import styles from "./AttendanceTable.module.css";

/**
 * AttendanceTable
 *
 * "Today's Attendance" table for the Attendance Management page.
 * Column shape (Candidate id / Name / Batch / Course + progress /
 * Time in / Time out / Status / Action) is specific to attendance
 * records, so it lives inside pages/AttendanceManagement rather than
 * /shared - only the generic bits (StatusBadge, ProgressBar,
 * ActionButtons) come from /shared, same pattern as CandidateTable.
 *
 * The row action buttons only show view/edit/delete (no lock), so
 * ActionButtons is called with showLock={false}.
 */
export default function AttendanceTable({ records = [], onView, onEdit, onDelete }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input type="checkbox" aria-label="Select all candidates" />
            </th>
            <th>Candidate id</th>
            <th>Name</th>
            <th>Batch</th>
            <th>Course</th>
            <th>Time in</th>
            <th>Time out</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <input type="checkbox" defaultChecked aria-label={`Select ${record.name}`} />
              </td>
              <td className={styles.idCell}>{record.candidateId}</td>
              <td>
                <div className={styles.nameCell}>
                  <UserCircle2 size={22} className={styles.avatarIcon} />
                  <span>{record.name}</span>
                </div>
              </td>
              <td>{record.batch}</td>
              <td>
                <div className={styles.courseCell}>
                  <span>{record.course}</span>
                  <ProgressBar value={record.progress} />
                </div>
              </td>
              <td className={styles.nowrap}>{record.timeIn}</td>
              <td className={styles.nowrap}>{record.timeOut}</td>
              <td>
                <StatusBadge status={record.status} />
              </td>
              <td>
                <ActionButtons
                  showLock={false}
                  onView={() => onView?.(record)}
                  onEdit={() => onEdit?.(record)}
                  onDelete={() => onDelete?.(record)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
