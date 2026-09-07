import { useMemo, useState } from 'react';
import { X, UserCircle2 } from 'lucide-react';
import { Button } from '../../../shared';
import './MarkAttendanceModal.css';

const STATUSES = ['Present', 'Absent', 'Late'];

/**
 * MarkAttendanceModal
 *
 * Popup opened by a session row's "Mark attendance" pill. Lists every
 * student on that session's batch roster with a 3-way Present /
 * Absent / Late toggle (everyone defaults to Present so the trainer
 * only has to click to flip exceptions). Live counts at the top
 * update as toggles change.
 *
 * Fires onSave(session, attendanceList) with one entry per student so
 * the parent (AttendanceTracker) can mark the session done and store
 * the results for the read-only detail view.
 */
export default function MarkAttendanceModal({
  session,
  roster = [],
  onCancel,
  onSave,
}) {
  // Map of candidateId -> "Present" | "Absent" | "Late". Missing
  // entries default to Present, so nothing needs pre-seeding here -
  // unless this session was already marked before, in which case we
  // seed from its saved attendance so re-opening it shows prior state.
  const initialStatus = useMemo(() => {
    const map = {};
    (session?.attendance ?? []).forEach((entry) => {
      map[entry.candidateId] = entry.status;
    });
    return map;
  }, [session]);

  const [statusById, setStatusById] = useState(initialStatus);

  const getStatus = (student) => statusById[student.candidateId] || 'Present';
  const setStatus = (student, status) => {
    setStatusById((prev) => ({
      ...prev,
      [student.candidateId]: status,
    }));
  };

  const counts = useMemo(() => {
    const tally = { Present: 0, Absent: 0, Late: 0 };
    roster.forEach((student) => {
      tally[getStatus(student)] += 1;
    });
    return tally;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusById, roster]);

  const handleSave = () => {
    const attendanceList = roster.map((student) => ({
      candidateId: student.candidateId,
      name: student.name,
      status: getStatus(student),
    }));
    onSave?.(session, attendanceList);
  };

  if (!session) return null;

  return (
    <div
      className={'attendance-management-mark-attendance-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Mark attendance"
      onClick={onCancel}
    >
      <div
        className={'attendance-management-mark-attendance-modal-modal'}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={'attendance-management-mark-attendance-modal-close-btn'}
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className={'attendance-management-mark-attendance-modal-header'}>
          <div>
            <h2 className={'attendance-management-mark-attendance-modal-title'}>
              {session.title}
            </h2>
            <p className={'attendance-management-mark-attendance-modal-subtitle'}>
              {session.subtitle}
            </p>
            <p className={'attendance-management-mark-attendance-modal-batch'}>
              Batch-{session.batch}
            </p>
          </div>

          <div className={'attendance-management-mark-attendance-modal-counts'}>
            {STATUSES.map((label) => (
              <div
                key={label}
                className={`${'attendance-management-mark-attendance-modal-count-box'} ${
                  'attendance-management-mark-attendance-modal-count-' + label.toLowerCase()
                }`}
              >
                <span className={'attendance-management-mark-attendance-modal-count-label'}>
                  {label}
                </span>
                <span className={'attendance-management-mark-attendance-modal-count-value'}>
                  {counts[label]}/{roster.length}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={'attendance-management-mark-attendance-modal-student-list'}>
          {roster.map((student) => {
            const status = getStatus(student);
            return (
              <div
                key={student.candidateId}
                className={'attendance-management-mark-attendance-modal-student-row'}
              >
                <div className={'attendance-management-mark-attendance-modal-student-info'}>
                  <UserCircle2
                    size={22}
                    className={'attendance-management-mark-attendance-modal-student-avatar'}
                  />
                  <span className={'attendance-management-mark-attendance-modal-student-name'}>
                    {student.name}
                  </span>
                </div>

                <div
                  className={'attendance-management-mark-attendance-modal-toggle'}
                  role="group"
                  aria-label={`${student.name} attendance`}
                >
                  {STATUSES.map((label) => (
                    <button
                      key={label}
                      type="button"
                      className={`${'attendance-management-mark-attendance-modal-toggle-btn'} ${
                        'attendance-management-mark-attendance-modal-toggle-btn-' + label.toLowerCase()
                      } ${
                        status === label
                          ? 'attendance-management-mark-attendance-modal-toggle-btn-active'
                          : ''
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
            <p className={'attendance-management-mark-attendance-modal-empty'}>
              No students found for this batch's roster.
            </p>
          )}
        </div>

        <div className={'attendance-management-mark-attendance-modal-actions'}>
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
