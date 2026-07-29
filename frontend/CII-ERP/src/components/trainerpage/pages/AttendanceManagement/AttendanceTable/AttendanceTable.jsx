import { UserCircle2 } from 'lucide-react';
import { StatusBadge, ProgressBar, ActionButtons } from '../../../shared';
import './AttendanceTable.css';

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
export default function AttendanceTable({
  records = [],
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className={'tableWrap'}>
      <table className={'table'}>
        <thead>
          <tr>
            <th className={'checkboxCol'}>
              <input type="checkbox" aria-label="Select all candidates" />
            </th>
            <th>Candidate id</th>
            <th>Name</th>
            <th>Batch</th>
            {/* <th>Course</th> */}
            <th>Time in</th>
            <th>Time out</th>
            <th>Status</th>
            <th>Trainer Attendence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <input
                  type="checkbox"
                  defaultChecked
                  aria-label={`Select ${record.name}`}
                />
              </td>
              <td className={'idCell'}>{record.candidateId}</td>
              <td>
                <div className={'nameCell'}>
                  <UserCircle2 size={22} className={'avatarIcon'} />
                  <span>{record.name}</span>
                </div>
              </td>
              <td>{record.batch}</td>
              {/* <td>
                <div className={styles.courseCell}>
                  <span>{record.course}</span>
                  <ProgressBar value={record.progress} />
                </div>
               </td> */}
              <td className={'nowrap'}>{record.timeIn}</td>
              <td className={'nowrap'}>{record.timeOut}</td>
              <td>
                <StatusBadge status={record.status} />
              </td>
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
