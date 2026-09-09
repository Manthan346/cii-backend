import { X, UserCircle2 } from "lucide-react";
import { StatusBadge } from "../../../shared";
import "./SessionAttendancePopup.css";

/**
 * SessionAttendancePopup
 *
 * Modal opened by the eye icon in SessionsTable's Status column.
 * Shows one session's candidate-level attendance (present/absent/late)
 * fetched live from getSessionAttendanceHistory, independent of
 * SessionDetailView's swap-in-place view.
 *
 * Props:
 *  - isOpen, onClose
 *  - session: { batch_code, session_date } or null while loading
 *  - summary: { total, present, absent, late } or null
 *  - records: [{ attendance_id, attendance_status, remarks,
 *                candidates_details: { candidate_unique_id,
 *                candidate_first_name, candidate_last_name } }]
 *  - loading, error
 */
export default function SessionAttendancePopup({
  isOpen,
  onClose,
  session,
  summary,
  records = [],
  loading,
  error,
}) {
  if (!isOpen) return null;

  return (
    <div className="session-attendance-popup-overlay" onClick={onClose}>
      <div
        className="session-attendance-popup-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="session-attendance-popup-header">
          <div>
            <h2 className="session-attendance-popup-title">
              Session Attendance
            </h2>
            {session && (
              <p className="session-attendance-popup-subtitle">
                {session.batch_code} · {session.session_date}
              </p>
            )}
          </div>
          <button
            type="button"
            className="session-attendance-popup-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {summary && (
          <div className="session-attendance-popup-summary">
            <span className="session-attendance-popup-summary-item">
              Total <strong>{summary.total}</strong>
            </span>
            <span className="session-attendance-popup-summary-item session-attendance-popup-summary-item--present">
              Present <strong>{summary.present}</strong>
            </span>
            <span className="session-attendance-popup-summary-item session-attendance-popup-summary-item--absent">
              Absent <strong>{summary.absent}</strong>
            </span>
            <span className="session-attendance-popup-summary-item session-attendance-popup-summary-item--late">
              Late <strong>{summary.late}</strong>
            </span>
          </div>
        )}

        <div className="session-attendance-popup-list-wrap">
          {loading && (
            <p className="session-attendance-popup-state">
              Loading attendance...
            </p>
          )}
          {error && (
            <p className="session-attendance-popup-state session-attendance-popup-state--error">
              {error}
            </p>
          )}

          {!loading && !error && (
            <table className="session-attendance-popup-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.attendance_id}>
                    <td>
                      <div className="session-attendance-popup-name-cell">
                        <UserCircle2
                          size={20}
                          className="session-attendance-popup-avatar"
                        />
                        <div>
                          <span className="session-attendance-popup-name">
                            {record.candidates_details?.candidate_first_name}{" "}
                            {record.candidates_details?.candidate_last_name}
                          </span>
                          <span className="session-attendance-popup-id">
                            {record.candidates_details?.candidate_unique_id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={record.attendance_status} />
                    </td>
                    <td className="session-attendance-popup-remarks">
                      {record.remarks || "—"}
                    </td>
                  </tr>
                ))}

                {records.length === 0 && (
                  <tr>
                    <td colSpan={3} className="session-attendance-popup-empty">
                      No attendance recorded for this session yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
