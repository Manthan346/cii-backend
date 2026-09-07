import { PlusCircle } from "lucide-react";
import "./SessionsTable.css";

/**
 * SessionsTable
 *
 * "Today's Attendance" table for the Attendance tracker's default
 * (list) view. Each row is one SESSION, not one candidate - matches
 * the reference "Attendance tracker" screen.
 *
 * Behavior:
 *  - Clicking the "Mark attendance" pill opens the Mark Attendance
 *    modal for that session (stopPropagation so it doesn't also
 *    trigger the row click below).
 *  - Clicking anywhere else on a row opens the read-only session
 *    detail view. The detail view loads the session's persisted
 *    attendance records, including after a page reload.
 */
export default function SessionsTable({ sessions = [], onMark, onViewDetail }) {
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
                colSpan={6}
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
