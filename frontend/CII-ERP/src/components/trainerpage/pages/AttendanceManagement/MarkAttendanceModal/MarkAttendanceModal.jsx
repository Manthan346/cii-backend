import { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { Button } from '../../../shared';
import './MarkAttendanceModal.css';

/**
 * MarkAttendanceModal
 *
 * "+ Mark attendance" popup. Instead of a one-candidate-at-a-time form,
 * it lists every student with a Present/Absent toggle next to their
 * name. Everyone starts out Present when the popup opens; the trainer
 * only has to click to flip someone to Absent (only one of the two can
 * be selected at a time per student - it's a toggle, not a checkbox).
 *
 * Fires onSave(attendanceList) with one entry per student so the
 * parent (AttendanceTracker) can turn it into table rows.
 */
export default function MarkAttendanceModal({
  students = [],
  defaultDate = '',
  onCancel,
  onSave,
}) {
  const [date, setDate] = useState(defaultDate);
  // Map of candidateId -> "Present" | "Absent". Missing entries default
  // to Present, so nothing needs pre-seeding here.
  const [statusById, setStatusById] = useState({});
  const getStatus = (student) => statusById[student.id] || 'Present';
  const setStatus = (student, status) => {
    setStatusById((prev) => ({
      ...prev,
      [student.id]: status,
    }));
  };
  const handleSave = () => {
    const attendanceList = students.map((student) => ({
      id: student.id,
      candidateId: student.candidateId,
      name: student.name,
      batch: student.batch,
      course: student.course,
      status: getStatus(student),
    }));
    onSave?.({
      date,
      attendanceList,
    });
  };
  return (
    <div
      className={'attendance-management-mark-attendance-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Mark attendance"
    >
      <div className={'attendance-management-mark-attendance-modal-modal'}>
        <h2 className={'attendance-management-mark-attendance-modal-title'}>
          Mark Attendance
        </h2>

        <div className={'attendance-management-mark-attendance-modal-field'}>
          <label
            className={'attendance-management-mark-attendance-modal-label'}
          >
            Date
          </label>
          <input
            type="text"
            className={'attendance-management-mark-attendance-modal-input'}
            placeholder="dd-mm-yy"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div
          className={'attendance-management-mark-attendance-modal-student-list'}
        >
          {students.map((student) => {
            const status = getStatus(student);
            const isPresent = status === 'Present';
            return (
              <div
                key={student.id}
                className={
                  'attendance-management-mark-attendance-modal-student-row'
                }
              >
                <div
                  className={
                    'attendance-management-mark-attendance-modal-student-info'
                  }
                >
                  <UserCircle2
                    size={22}
                    className={
                      'attendance-management-mark-attendance-modal-student-avatar'
                    }
                  />
                  <div
                    className={
                      'attendance-management-mark-attendance-modal-student-text'
                    }
                  >
                    <span
                      className={
                        'attendance-management-mark-attendance-modal-student-name'
                      }
                    >
                      {student.name}
                    </span>
                    <span
                      className={
                        'attendance-management-mark-attendance-modal-student-id'
                      }
                    >
                      {student.candidateId}
                    </span>
                  </div>
                </div>

                <div
                  className={
                    'attendance-management-mark-attendance-modal-toggle'
                  }
                  role="group"
                  aria-label={`${student.name} attendance`}
                >
                  <button
                    type="button"
                    className={`${'attendance-management-mark-attendance-modal-toggle-btn'} ${'attendance-management-mark-attendance-modal-toggle-btn-present'} ${isPresent ? 'attendance-management-mark-attendance-modal-toggle-btn-active' : ''}`}
                    aria-pressed={isPresent}
                    onClick={() => setStatus(student, 'Present')}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    className={`${'attendance-management-mark-attendance-modal-toggle-btn'} ${'attendance-management-mark-attendance-modal-toggle-btn-absent'} ${!isPresent ? 'attendance-management-mark-attendance-modal-toggle-btn-active' : ''}`}
                    aria-pressed={!isPresent}
                    onClick={() => setStatus(student, 'Absent')}
                  >
                    Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={'attendance-management-mark-attendance-modal-actions'}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Attendance
          </Button>
        </div>
      </div>
    </div>
  );
}
