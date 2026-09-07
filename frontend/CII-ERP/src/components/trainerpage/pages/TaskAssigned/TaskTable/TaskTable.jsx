import { StatusBadge, ActionButtons } from "../../../shared";
import "./TaskTable.css";

/**
 * TaskTable
 *
 * "All Task" table for the (full) Task Assigned page. Column shape
 * (Task title+subtitle / Assigned to / Priority / Due date / Status /
 * Action) is specific to tasks, so it lives inside pages/TaskAssigned
 * rather than /shared — only the generic bits (StatusBadge, Avatar,
 * ActionButtons) come from /shared, same pattern as CandidateTable /
 * AttendanceTable.
 *
 * The Priority pill reuses <StatusBadge> (High/medium/low tones were
 * added to shared/StatusBadge for this), same as the Status pill
 * (Present/absent/late tones already existed there).
 *
 * Row actions only show view/edit/delete (no lock), so ActionButtons
 * is called with showLock={false} — matching the reference design.
 */
export default function TaskTable({ tasks = [], onView, onEdit, onDelete }) {
  return (
    <div className="task-table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Assigned to</th>
            <th>Priority</th>
            <th>Due date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <div className="task-table__task-cell">
                  <p className="task-table__task-title">{task.title}</p>
                  <p className="task-table__task-subtitle">{task.subtitle}</p>
                </div>
              </td>
              <td className="task-table__nowrap">
                {task.assignedTo ?? task.assignee}
              </td>
              <td>
                <StatusBadge status={task.priority} />
              </td>
              <td className="task-table__nowrap">{task.dueDate}</td>
              <td>
                <StatusBadge status={task.status} />
              </td>
              <td>
                <ActionButtons
                  showLock={false}
                  onView={() => onView?.(task)}
                  onEdit={() => onEdit?.(task)}
                  onDelete={() => onDelete?.(task)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
