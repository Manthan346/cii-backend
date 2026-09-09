import { useMemo, useState } from "react";
import { X, UserCircle2 } from "lucide-react";
import { Button } from "../../../shared";
import "./MarkAttendanceModal.css";

const STATUSES = ["Present", "Absent", "Late"];

/**
 * MarkAttendanceModal
 *
 * Popup opened by a session row's "Mark attendance" pill. Lists every
 * student on that session's batch roster with a 3-way Present /
 * Absent / Late toggle.
 *
 * No default status is shown — a student only displays a highlighted
 * button once they have an actual status, either seeded from a prior
 * mark-attendance pass on this session (session.attendance) or from
 * clicking a button just now. Untouched, never-before-marked students
 * stay visually unmarked and are excluded entirely from the payload
 * sent on Save, so the backend never overwrites/creates a record for
 * someone the trainer didn't actually mark.
 */
export default function MarkAttendanceModal({
  session,
  roster = [],
  onCancel,
  onSave,
}) {
  // Map of candidateId -> "Present" | "Absent" | "Late", seeded only
  // from this session's previously saved attendance (if any). Students
  // with no prior record and no click yet simply have no key here.
  const initialStatus = useMemo(() => {
    const map = {};
    (session?.attendance ?? []).forEach((entry) => {
      if (entry.status) {
        map[entry.candidateId] = entry.status;
      }
    });
    return map;
  }, [session]);

  const [statusById, setStatusById] = useState(initialStatus);

  // No fallback — returns undefined for a student with no previous
  // record and no click yet, which is exactly the "unmarked" state.
  const getStatus = (student) => statusById[student.candidateId];

  const setStatus = (student, status) => {
    setStatusById((prev) => ({
      ...prev,
      [student.candidateId]: status,
    }));
  };

  const counts = useMemo(() => {
    const tally = { Present: 0, Absent: 0, Late: 0, Unmarked: 0 };
    roster.forEach((student) => {
      const status = statusById[student.candidateId];
      if (status) {
        tally[status] += 1;
      } else {
        tally.Unmarked += 1;
      }
    });
    return tally;
  }, [statusById, roster]);

  const handleSave = () => {
    // Only students with an actual status (previously saved or just
    // clicked) are sent — untouched, never-marked students are left
    // out of the payload entirely rather than defaulted to anything.
    const attendanceList = roster
      .filter((student) => Boolean(statusById[student.candidateId]))
      .map((student) => ({
        candidateId: student.candidateId,
        name: student.name,
        status: statusById[student.candidateId],
      }));

    onSave?.(session, attendanceList);
  };

  if (!session) return null;

  return (
    <div
      className={"attendance-management-mark-attendance-modal-overlay"}
      role="dialog"
      aria-modal="true"
      aria-label="Mark attendance"
      onClick={onCancel}
    >
      <div
        className={"attendance-management-mark-attendance-modal-modal"}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={"attendance-management-mark-attendance-modal-close-btn"}
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={"attendance-management-mark-attendance-modal-header"}>
          <div>
            <h2 className={"attendance-management-mark-attendance-modal-title"}>
              {session.title}
            </h2>
            <p
              className={"attendance-management-mark-attendance-modal-subtitle"}
            >
              {session.subtitle}
            </p>
            <p className={"attendance-management-mark-attendance-modal-batch"}>
              Batch-{session.batch}
            </p>
          </div>

          <div className={"attendance-management-mark-attendance-modal-counts"}>
            {[...STATUSES, "Unmarked"].map((label) => (
              <div
                key={label}
                className={`${"attendance-management-mark-attendance-modal-count-box"} ${
                  "attendance-management-mark-attendance-modal-count-" +
                  label.toLowerCase()
                }`}
              >
                <span
                  className={
                    "attendance-management-mark-attendance-modal-count-label"
                  }
                >
                  {label}
                </span>
                <span
                  className={
                    "attendance-management-mark-attendance-modal-count-value"
                  }
                >
                  {counts[label]}/{roster.length}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={"attendance-management-mark-attendance-modal-student-list"}
        >
          {roster.map((student) => {
            const status = getStatus(student);
            return (
              <div
                key={student.candidateId}
                className={
                  "attendance-management-mark-attendance-modal-student-row"
                }
              >
                <div
                  className={
                    "attendance-management-mark-attendance-modal-student-info"
                  }
                >
                  <UserCircle2
                    size={22}
                    className={
                      "attendance-management-mark-attendance-modal-student-avatar"
                    }
                  />
                  <span
                    className={
                      "attendance-management-mark-attendance-modal-student-name"
                    }
                  >
                    {student.name}
                  </span>
                </div>

                <div
                  className={
                    "attendance-management-mark-attendance-modal-toggle"
                  }
                  role="group"
                  aria-label={`${student.name} attendance`}
                >
                  {STATUSES.map((label) => (
                    <button
                      key={label}
                      type="button"
                      className={`${"attendance-management-mark-attendance-modal-toggle-btn"} ${
                        "attendance-management-mark-attendance-modal-toggle-btn-" +
                        label.toLowerCase()
                      } ${
                        status === label
                          ? "attendance-management-mark-attendance-modal-toggle-btn-active"
                          : ""
                      }`}
                      aria-pressed={status === label}
                      onClick={() => setStatus(student, label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {roster.length === 0 && (
            <p className={"attendance-management-mark-attendance-modal-empty"}>
              No students found for this batch's roster.
            </p>
          )}
        </div>

        <div className={"attendance-management-mark-attendance-modal-actions"}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
