import StatusBadge from "../StatusBadge/StatusBadge";
import ActionButtons from "../ActionButtons/ActionButtons";
import "./BatchTable.css";

/**
 * BatchTable
 *
 * "All Batches" table for the Batch Management page. Column shape is
 * Batch name/code, course, candidate count, dates, date-derived status,
 * and row actions are specific to this page.
 */
export default function BatchTable({
  batches = [],
  onView,
  onEdit,
}) {
  return (
    <div className={"batch-management-batch-list-batch-table-table-wrap"}>
      <table className={"batch-management-batch-list-batch-table-table"}>
        <thead>
          <tr>
            <th>Batch Name</th>
            <th>Batch Code</th>
            <th>Course</th>
            <th>Candidates</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td>
                {batch.name}
              </td>
              <td className="batch-management-batch-list-batch-table-batch-code">
                {batch.code}
              </td>
              <td>{batch.course}</td>
              <td>{batch.candidates}</td>
              <td className={"batch-management-batch-list-batch-table-nowrap"}>
                {batch.startDate}
              </td>
              <td className={"batch-management-batch-list-batch-table-nowrap"}>
                {batch.endDate}
              </td>
              <td>
                <StatusBadge status={batch.status} />
              </td>
              <td>
                <ActionButtons
                  onView={() => onView?.(batch)}
                  onEdit={() => onEdit?.(batch)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
