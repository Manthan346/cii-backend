import { UserCircle2, ArrowLeft } from "lucide-react";
import { StatusBadge } from "../../../shared";
import "./SessionDetailView.css";

/**
 * SessionDetailView
 *
 * Read-only breakdown of one session's attendance results - the "3rd
 * screen". Reached by clicking a session row in SessionsTable (only
 * once that session has been marked). Unlike SessionsTable, every row
 * here is one STUDENT rather than one session, so Batch/Time/Date/Class
 * room repeat the same session-level values on every row - this view only
 * ever shows a single session at a time.
 *
 * Not a popup/overlay - it swaps in place of SessionsTable within the
 * same table-section card, matching the reference "Attendance
 * tracker" screen where the stat cards and filter bar above stay put.
 */
export default function SessionDetailView({ session, onBack }) {
  if (!session) return null;

  return (
    <div className={"attendance-management-session-detail-view-wrap"}>
      <button
        type="button"
        className={"attendance-management-session-detail-view-back-btn"}
        onClick={onBack}
      >
        <ArrowLeft size={15} />
        Back to sessions
      </button>

      <div className={"attendance-management-session-detail-view-table-wrap"}>
        <table className={"attendance-management-session-detail-view-table"}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Batch</th>
              <th>Time</th>
              <th>Date</th>
              <th>Class room</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {session.attendance.map((entry) => (
              <tr key={entry.candidateId}>
                <td>
                  <div
                    className={
                      "attendance-management-session-detail-view-name-cell"
                    }
                  >
                    <UserCircle2
                      size={22}
                      className={
                        "attendance-management-session-detail-view-avatar"
                      }
                    />
                    <span>{entry.name}</span>
                  </div>
                </td>
                <td>{session.batch}</td>
                <td
                  className={"attendance-management-session-detail-view-nowrap"}
                >
                  {session.time}
                </td>
                <td
                  className={"attendance-management-session-detail-view-nowrap"}
                >
                  {session.date}
                </td>
                <td>{session.classroom}</td>
                <td>
                  <StatusBadge status={entry.status} />
                </td>
              </tr>
            ))}

            {session.attendance.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className={"attendance-management-session-detail-view-empty"}
                >
                  No attendance recorded for this session yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
