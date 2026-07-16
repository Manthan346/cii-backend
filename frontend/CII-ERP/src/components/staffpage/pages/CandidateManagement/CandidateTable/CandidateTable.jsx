import { UserCircle2 } from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import ProgressBar from "../ProgressBar/ProgressBar";
import { ActionButtons } from "../../../shared";
import styles from "./CandidateTable.module.css";

/**
 * CandidateTable
 *
 * "All Candidates" table for the Candidate Management page. Column shape
 * is specific to candidates, so this lives inside pages/CandidateManagement
 * rather than /shared - only the generic row-action icon buttons come
 * from /shared (ActionButtons), since those are reusable on any table.
 */
export default function CandidateTable({ candidates = [] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input type="checkbox" aria-label="Select all candidates" />
            </th>
            <th>Candidates ID</th>
            <th>Name</th>
            <th>Batch</th>
            <th>Course</th>
            <th>Contact</th>
            <th>Join Date</th>
            <th>Attendance</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>
                <input type="checkbox" defaultChecked aria-label={`Select ${candidate.name}`} />
              </td>
              <td className={styles.idCell}>{candidate.candidateId}</td>
              <td>
                <div className={styles.nameCell}>
                  <UserCircle2 size={22} className={styles.avatarIcon} />
                  <span>{candidate.name}</span>
                </div>
              </td>
              <td>{candidate.batch}</td>
              <td>
                <div className={styles.courseCell}>
                  <span>{candidate.course}</span>
                  <ProgressBar percent={candidate.progress} />
                </div>
              </td>
              <td>{candidate.contact}</td>
              <td className={styles.nowrap}>{candidate.joinDate}</td>
              <td className={styles.attendanceCell}>{candidate.attendance}%</td>
              <td>
                <StatusBadge status={candidate.status} />
              </td>
              <td>
                <ActionButtons />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
