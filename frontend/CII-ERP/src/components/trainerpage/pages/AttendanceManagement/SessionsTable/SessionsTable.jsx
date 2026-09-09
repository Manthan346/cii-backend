import { PlusCircle, Eye } from "lucide-react";
import "./SessionsTable.css";

/**
 * SessionsTable
 *
 * Status column now holds only the eye icon, which opens
 * SessionAttendancePopup (candidate-level present/absent/late) via
 * onViewAttendance. "Mark attendance" has moved to its own trailing,
 * unlabeled column. Row click still opens the in-place SessionDetailView
 * via onViewDetail, unchanged from before.
 */
export default function SessionsTable({
  sessions = [],
  onMark,
  onViewDetail,
  onViewAttendance,
}) {
  return (
    <div className={"attendance-management-sessions-table-table-wrap"}>
      <table className={"attendance-management-sessions-table-table"}>
        <thead>
          <tr>
            <th>Session</th>
            <th>Batch</th>
            <th>Date</th>
            <th>Time</th>
            <th>Class room</th>
            <th>Status</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => {
            return (
              <tr
                key={session.id}
                onClick={() => onViewDetail?.(session)}
                className={
                  "attendance-management-sessions-table-row attendance-management-sessions-table-row-clickable"
                }
                title={"View attendance for this session"}
              >
                <td>
                  <div
                    className={
                      "attendance-management-sessions-table-session-cell"
                    }
                  >
                    <span
                      className={
                        "attendance-management-sessions-table-session-title"
                      }
                    >
                      {index + 1}. {session.title}
                    </span>
                    <span
                      className={
                        "attendance-management-sessions-table-session-subtitle"
                      }
                    >
                      {session.subtitle}
                    </span>
                  </div>
                </td>
                <td>{session.batch}</td>
                <td className={"attendance-management-sessions-table-nowrap"}>
                  {session.date}
                </td>
                <td className={"attendance-management-sessions-table-nowrap"}>
                  {session.time}
                </td>
                <td>{session.classroom}</td>
                <td>
                  <button
                    type="button"
                    className={"attendance-management-sessions-table-eye-btn"}
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewAttendance?.(session);
                    }}
                    aria-label={`View attendance for session ${index + 1}`}
                  >
                    <Eye size={16} />
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={"attendance-management-sessions-table-mark-btn"}
                    onClick={(event) => {
                      event.stopPropagation();
                      onMark?.(session);
                    }}
                  >
                    <PlusCircle size={14} />
                    Mark attendance
                  </button>
                </td>
              </tr>
            );
          })}

          {sessions.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className={"attendance-management-sessions-table-empty"}
              >
                No sessions match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}