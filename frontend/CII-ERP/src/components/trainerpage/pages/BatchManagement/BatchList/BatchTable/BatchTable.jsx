import { UserCircle2 } from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import ActionButtons from "../ActionButtons/ActionButtons";
import styles from "./BatchTable.module.css";

/**
 * BatchTable
 *
 * "All Batches" table for the Batch Management page. Column shape is
 * specific to batches (batch code, trainer, course, candidate count,
 * start date, status, row actions), so this lives inside
 * pages/BatchManagement/BatchList rather than /shared. Schedule subtext
 * and the course progress bar were removed per request.
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
                  <span className={styles.batchCode}>{batch.code}</span>
                </div>
              </td>
              <td>
                <div className={styles.trainerCell}>
                  <UserCircle2 size={20} className={styles.trainerIcon} />
                  <span>{batch.trainer}</span>
                </div>
              </td>
              <td>{batch.course}</td>
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
