import api from "../api";
import { fetchPaginatedPage } from "./paginationService";

/**
 * Fetches paginated attendance sessions for the instructor's company.
 * Maps to getAllAttendanceSessions — filters (search, batch_id, course_id,
 * session_date) and pagination (page, limit) match the controller's
 * req.query / req.pagination handling.
 */
export async function fetchAttendanceSessions({
  page = 1,
  limit = 15,
  search,
  batchId,
  courseId,
  sessionDate,
} = {}) {
  const params = { limit };

  if (search && search.trim()) params.search = search.trim();
  if (batchId) params.batch_id = batchId;
  if (courseId) params.course_id = courseId;
  if (sessionDate) params.session_date = sessionDate;

  return fetchPaginatedPage({
    fetchPage: async (requestPage) => {
      const res = await api.get(
        "/instructor/attendance-management/get-sessions",
        { params: { ...params, page: requestPage } },
      );
      return res.data.data;
    },
    page,
    limit,
    itemsKey: "sessions",
  });
}

export async function fetchActiveStudentsForSession(attendanceSessionId) {
  const res = await api.get(
    `/instructor/attendance-sessions/${attendanceSessionId}/active-students`,
  );
  return res.data.data; // { session: { attendance_session_id, batch_id, batch_code }, students }
}

export async function markCandidateAttendance(
  attendanceSessionId,
  attendanceList,
) {
  const res = await api.post(
    `/instructor/mark-candidate-attendnace/${attendanceSessionId}`, // note: "attendnace" typo is in the real route, kept as-is
    {
      attendance: attendanceList.map((entry) => ({
        candidateId: entry.candidateId,
        attendanceStatus: entry.status.toLowerCase(), // "Present" -> "present"
        remarks: entry.remarks ?? "", // ⚠️ unconfirmed whether addAttendanceBodySchema requires this or allows empty/omitted
      })),
    },
  );
  return res.data;
}

export async function fetchAttendanceSessionDetails(attendanceSessionId) {
  const res = await api.get(
    `/instructor/attendance-management/get-sessions/${attendanceSessionId}`,
  );
  return res.data.data; // { attendanceTaken, session, attendanceRecords }
}

/**
 * -> fetchSessionAttendanceHistory (GET /instructor/attendance-sessions/:id/history)
 * Powers the SessionAttendancePopup eye-icon modal — per-candidate
 * present/absent/late records for one session, plus a summary count.
 */
export async function fetchSessionAttendanceHistory(attendanceSessionId) {
  const res = await api.get(
    `/instructor/attendance-sessions/${attendanceSessionId}/history`,
  );
  return res.data.data; // { session, summary: { total, present, absent, late }, records }
}
