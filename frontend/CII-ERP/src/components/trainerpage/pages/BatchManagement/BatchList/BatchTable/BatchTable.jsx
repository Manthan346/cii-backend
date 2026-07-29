import { UserCircle2 } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import ActionButtons from '../ActionButtons/ActionButtons';
import './BatchTable.css';

/**
 * BatchTable
 *
 * "All Batches" table for the Batch Management page. Column shape is
 * specific to batches (batch code, trainer, course, candidate count,
 * start date, status, row actions), so this lives inside
 * pages/BatchManagement/BatchList rather than /shared. Schedule subtext
 * and the course progress bar were removed per request.
 */
export default function BatchTable({
  batches = [],
  onView,
  onDelete,
  onAssignTrainer,
}) {
  return (
    <div className={'batch-management-batch-list-batch-table-table-wrap'}>
      <table className={'batch-management-batch-list-batch-table-table'}>
        <thead>
          <tr>
            <th
              className={'batch-management-batch-list-batch-table-checkbox-col'}
            >
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
                <input
                  type="checkbox"
                  defaultChecked
                  aria-label={`Select ${batch.code}`}
                />
              </td>
              <td>
                <div
                  className={
                    'batch-management-batch-list-batch-table-batch-cell'
                  }
                >
                  <span
                    className={
                      'batch-management-batch-list-batch-table-batch-icon'
                    }
                    aria-hidden="true"
                  />
                  <span
                    className={
                      'batch-management-batch-list-batch-table-batch-code'
                    }
                  >
                    {batch.code}
                  </span>
                </div>
              </td>
              <td>
                <div
                  className={
                    'batch-management-batch-list-batch-table-trainer-cell'
                  }
                >
                  <UserCircle2
                    size={20}
                    className={
                      'batch-management-batch-list-batch-table-trainer-icon'
                    }
                  />
                  <span>{batch.trainer}</span>
                </div>
              </td>
              <td>{batch.course}</td>
              <td>{batch.candidates}</td>
              <td className={'batch-management-batch-list-batch-table-nowrap'}>
                {batch.startDate}
              </td>
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
