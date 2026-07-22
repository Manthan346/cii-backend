import { UserCircle2 } from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import ProgressBar from "../ProgressBar/ProgressBar";
import ActionButtons from "../ActionButtons/ActionButtons";
import styles from "./BatchTable.module.css";

/**
 * BatchTable
 *
 * "All Batches" table for the Batch Management page. Column shape is
 * specific to batches (code + schedule, trainer, course + progress,
 * candidate count, start date, status, row actions), so this lives
 * inside pages/BatchManagement/BatchList rather than /shared.
 */
export default function BatchTable({ batches = [], onView, onDelete, onAssignTrainer }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input type="checkbox" aria-label="Select all batches" />
            </th>
            <th>Batch</th>
            <th>Trainer</th>
            <th>Course</th>
            <th>candidates</th>
            <th>Start date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td>
                <input type="checkbox" defaultChecked aria-label={`Select ${batch.code}`} />
              </td>
              <td>
                <div className={styles.batchCell}>
                  <span className={styles.batchIcon} aria-hidden="true" />
                  <div className={styles.batchText}>
                    <span className={styles.batchCode}>{batch.code}</span>
                    <span className={styles.batchSchedule}>{batch.schedule}</span>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.trainerCell}>
                  <UserCircle2 size={20} className={styles.trainerIcon} />
                  <span>{batch.trainer}</span>
                </div>
              </td>
              <td>
                <div className={styles.courseCell}>
                  <span>{batch.course}</span>
                  <ProgressBar percent={batch.progress} />
                </div>
              </td>
              <td>{batch.candidates}</td>
              <td className={styles.nowrap}>{batch.startDate}</td>
              <td>
                <StatusBadge status={batch.status} />
              </td>
              <td>
                <ActionButtons
                  onView={() => onView?.(batch)}
                  onDelete={() => onDelete?.(batch)}
                  onAssignTrainer={() => onAssignTrainer?.(batch)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
