import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckSquare,
  XSquare,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";
import { Dropdown, Button, Pagination } from "../../../shared";
import StatCard from "../StatCard/StatCard";
import SessionsTable from "../SessionsTable/SessionsTable";
import SessionDetailView from "../SessionDetailView/SessionDetailView";
import MarkAttendanceModal from "../MarkAttendanceModal/MarkAttendanceModal";
import { attendanceStats, attendanceMeta } from "../../../data";
import {
  fetchAttendanceSessionDetails,
  fetchAttendanceSessions,
  fetchActiveStudentsForSession,
  markCandidateAttendance,
} from "../../../../../../api/trainer/attendanceService";
import { fetchCoursesAndBatches } from "../../../../../../api/trainer/candidateService";
import "./AttendanceTracker.css";

const STAT_ICONS = {
  calendar: Calendar,
  check: CheckSquare,
  close: XSquare,
  refresh: RefreshCw,
};

function formatSessionDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function formatSessionTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return date.toLocaleTimeString("en-US", options);
}

function mapSession(session) {
  return {
    id: session.attendance_session_id,
    title: session.topic_name,
    subtitle: "",
    batch: session.batch_details?.batch_code,
    date: formatSessionDate(session.session_date),
    time: formatSessionTime(session.session_time),
    classroom: session.room_no,
    marked: false,
    attendance: [],
  };
}

// Maps one entry from getActiveStudentsForSession's `students` array
// to the { candidateId, name } shape MarkAttendanceModal expects.
// candidateId here is the real candidate_id UUID, so it's safe to
// send straight into addCandidateAttendance on save.
function mapRosterStudent(student) {
  const details = student.candidates_details ?? {};
  return {
    candidateId: student.candidate_id,
    name: `${details.candidate_first_name ?? ""} ${
      details.candidate_last_name ?? ""
    }`.trim(),
  };
}

export default function AttendanceTracker() {
  const [sessionFilter, setSessionFilter] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [date, setDate] = useState(""); // now holds "YYYY-MM-DD" or ''
  const [currentPage, setCurrentPage] = useState(1);

  const [appliedFilters, setAppliedFilters] = useState({
    session: "",
    batch: "All Batches",
    date: "",
  });

  const [sessions, setSessions] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [markingSession, setMarkingSession] = useState(null);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const [viewedAttendance, setViewedAttendance] = useState([]);
  const [viewedAttendanceLoading, setViewedAttendanceLoading] = useState(false);

  useEffect(() => {
    if (!viewingSessionId) {
      setViewedAttendance([]);
      return;
    }
    let cancelled = false;
    setViewedAttendanceLoading(true);

    fetchAttendanceSessionDetails(viewingSessionId)
      .then((data) => {
        if (cancelled) return;
        const mapped = (data.attendanceRecords ?? []).map((rec) => {
          const d = rec.candidates_details ?? {};
          return {
            candidateId: d.candidate_id,
            name: `${d.candidate_first_name ?? ""} ${d.candidate_last_name ?? ""}`.trim(),
            status: rec.attendance_status
              ? rec.attendance_status.charAt(0).toUpperCase() +
                rec.attendance_status.slice(1).toLowerCase()
              : "Absent",
          };
        });
        setViewedAttendance(mapped);
      })
      .catch(() => !cancelled && setViewedAttendance([]))
      .finally(() => !cancelled && setViewedAttendanceLoading(false));

    return () => {
      cancelled = true;
    };
  }, [viewingSessionId]);

  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      setLoading(true);
      setError(null);
      try {
        const searchTerm = appliedFilters.session.trim() || undefined;

        const data = await fetchAttendanceSessions({
          page: currentPage,
          limit: 6,
          search: searchTerm,
          sessionDate: appliedFilters.date || undefined,
        });
        if (cancelled) return;
        setSessions((data.sessions ?? []).map(mapSession));
        setPagination({
          totalRecords: data.pagination?.totalRecords ?? 0,
          totalPages: data.pagination?.totalPages ?? 1,
        });
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSessions();
    return () => {
      cancelled = true;
    };
  }, [currentPage, appliedFilters]);

  // Fetch the real roster (active enrolled students) whenever a
  // session is opened for marking. Replaces the old mock
  // batchRosters[markingSession.batch] lookup.
  useEffect(() => {
    if (!markingSession) {
      setRoster([]);
      return;
    }
    let cancelled = false;
    setRosterLoading(true);

    fetchActiveStudentsForSession(markingSession.id)
      .then((data) => {
        if (cancelled) return;
        setRoster((data.students ?? []).map(mapRosterStudent));
      })
      .catch(() => {
        if (!cancelled) setRoster([]);
      })
      .finally(() => {
        if (!cancelled) setRosterLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [markingSession]);

  const [batchOptionsList, setBatchOptionsList] = useState(["All Batches"]);

  useEffect(() => {
    let cancelled = false;
    fetchCoursesAndBatches()
      .then((data) => {
        if (cancelled) return;
        const codes = (data.batches ?? []).map((b) => b.batch_code);
        setBatchOptionsList(["All Batches", ...codes]);
      })
      .catch(() => {
        // fall back to whatever's already in state (just 'All Batches')
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const sessionMatches =
        !appliedFilters.session.trim() ||
        session.title
          ?.toLowerCase()
          .includes(appliedFilters.session.trim().toLowerCase());
      const batchOk =
        appliedFilters.batch.toLowerCase().startsWith("all") ||
        session.batch === appliedFilters.batch;
      return sessionMatches && batchOk;
    });
  }, [sessions, appliedFilters]);

  const baseViewingSession =
    sessions.find((s) => s.id === viewingSessionId) || null;
  const viewingSession = baseViewingSession
    ? { ...baseViewingSession, attendance: viewedAttendance }
    : null;

  const handleApplyFilter = () => {
    setAppliedFilters({ session: sessionFilter, batch, date });
    setCurrentPage(1);
  };

  const handleSaveAttendance = async (session, attendanceList) => {
    try {
      await markCandidateAttendance(session.id, attendanceList);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session.id
            ? { ...s, marked: true, attendance: attendanceList }
            : s,
        ),
      );
      setMarkingSession(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      // TODO: surface a real error state instead of silently failing
      console.error("Failed to save attendance:", err);
    }
  };

  return (
    <div className={"attendance-management-attendance-tracker-content"}>
      {showToast && (
        <div
          className={"attendance-management-attendance-tracker-toast"}
          role="status"
        >
          Attendance saved successfully
        </div>
      )}

      <div className={"attendance-management-attendance-tracker-page-header"}>
        <div>
          <h1 className={"attendance-management-attendance-tracker-title"}>
            Attendance tracker
          </h1>
          <p className={"attendance-management-attendance-tracker-subtitle"}>
            Track daily attendance across {attendanceMeta.totalActiveBatches}{" "}
            active batches
          </p>
        </div>
      </div>

      <div className={"attendance-management-attendance-tracker-stats-grid"}>
        {attendanceStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={STAT_ICONS[stat.icon]}
            value={stat.value}
            label={stat.label}
            tone={stat.tone}
          />
        ))}
      </div>

      <div className={"attendance-management-attendance-tracker-filter-bar"}>
        <div className={"attendance-management-attendance-tracker-date-field"}>
          <label
            className={"attendance-management-attendance-tracker-filter-label"}
          >
            SESSION
          </label>
          <input
            type="text"
            className={"attendance-management-attendance-tracker-date-input"}
            value={sessionFilter}
            placeholder="Search session"
            onChange={(event) => setSessionFilter(event.target.value)}
          />
        </div>
        <Dropdown
          label="BATCH"
          options={batchOptionsList} // was: batchOptions
          value={batch}
          onChange={setBatch}
        />

        <div className={"attendance-management-attendance-tracker-date-field"}>
          <label
            className={"attendance-management-attendance-tracker-filter-label"}
          >
            DATE
          </label>
          <input
            type="date"
            className={"attendance-management-attendance-tracker-date-input"}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div className={"attendance-management-attendance-tracker-apply-wrap"}>
          <Button variant="outline" icon={Filter} onClick={handleApplyFilter}>
            Apply Filters
          </Button>
        </div>
      </div>

      <section
        className={"attendance-management-attendance-tracker-table-section"}
      >
        <div
          className={"attendance-management-attendance-tracker-table-header"}
        >
          <h2
            className={"attendance-management-attendance-tracker-table-title"}
          >
            {viewingSession ? (
              viewingSession.title
            ) : (
              <>
                Today's Attendance{" "}
                <span
                  className={
                    "attendance-management-attendance-tracker-table-date"
                  }
                >
                  {attendanceMeta.attendanceDate}
                </span>
              </>
            )}
          </h2>

          {!viewingSession && (
            <div
              className={
                "attendance-management-attendance-tracker-table-actions"
              }
            >
              <Button variant="outline" icon={Download}>
                Import
              </Button>
            </div>
          )}
        </div>

        {error && (
          <p className={"attendance-management-attendance-tracker-error"}>
            Couldn't load sessions. Please try again.
          </p>
        )}

        {loading ? (
          <p className={"attendance-management-attendance-tracker-loading"}>
            Loading sessions…
          </p>
        ) : viewingSession ? (
          viewedAttendanceLoading ? (
            <p className={"attendance-management-attendance-tracker-loading"}>
              Loading attendance…
            </p>
          ) : (
            <SessionDetailView
              session={viewingSession}
              onBack={() => setViewingSessionId(null)}
            />
          )
        ) : (
          <>
            <SessionsTable
              sessions={filteredSessions}
              onMark={setMarkingSession}
              onViewDetail={(session) => setViewingSessionId(session.id)}
            />

            <Pagination
              showing={filteredSessions.length}
              total={pagination.totalRecords}
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
              label={`Showing ${filteredSessions.length} of ${pagination.totalRecords}`}
            />
          </>
        )}
      </section>

      {markingSession && (
        <MarkAttendanceModal
          session={markingSession}
          roster={roster}
          rosterLoading={rosterLoading}
          onCancel={() => setMarkingSession(null)}
          onSave={handleSaveAttendance}
        />
      )}
    </div>
  );
}
