import API from "../api";

// Triggers a browser download from a Blob response.
function triggerBlobDownload(blob, fallbackFilename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fallbackFilename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// Pulls the real filename off Content-Disposition when the backend sends
// one, otherwise falls back to a sensible default.
function extractFilename(response, fallback) {
  const disposition = response.headers?.["content-disposition"];
  const match = disposition?.match(/filename="?([^"]+)"?/);
  return match?.[1] || fallback;
}

function buildReportParams({ fromMonth, fromYear, toMonth, toYear, courseId }) {
  const params = {};
  if (fromMonth) params.from_month = Number(fromMonth);
  if (fromYear) params.from_year = Number(fromYear);
  if (toMonth) params.to_month = Number(toMonth);
  if (toYear) params.to_year = Number(toYear);
  if (courseId && courseId !== "all") params.course_id = courseId;
  return params;
}

// With responseType: "blob", axios parses an error response's JSON body as
// a Blob too (not as JSON) — so err.response.data.message is normally
// undefined here. This reads the blob back out as text and re-parses it,
// so the real backend error message (e.g. "from_month, from_year, to_month,
// to_year are required") actually reaches the UI instead of a generic
// fallback string.
async function throwReportError(error) {
  const data = error?.response?.data;

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      throw new Error(parsed?.message || parsed?.error || "Export failed.");
    } catch {
      // Body wasn't JSON after all — fall through to the generic message below.
    }
  }

  throw new Error(
    error?.response?.data?.message || error?.message || "Export failed.",
  );
}

/**
 * -> downloadEnrollmentReport  (GET /reports/enrollment)
 * Query: from_month, from_year, to_month, to_year are REQUIRED by the
 * controller (despite the route being documented as "all optional") —
 * course_id is the only genuinely optional param.
 * Downloads the response as an .xlsx file.
 */
export async function downloadEnrollmentReport(filters = {}) {
  try {
    const response = await API.get("/admin/reports/enrollment", {
      params: buildReportParams(filters),
      responseType: "blob",
    });

    triggerBlobDownload(
      response.data,
      extractFilename(response, "enrollment-report.xlsx"),
    );
  } catch (error) {
    await throwReportError(error);
  }
}

/**
 * -> downloadEnquiryReport  (GET /reports/enquiry)
 * Query: from_month, from_year, to_month, to_year are REQUIRED by the
 * controller (same doc-vs-code gap as enrollment) — course_id is the
 * only genuinely optional param.
 * Downloads the response as an .xlsx file.
 */
export async function downloadEnquiryReport(filters = {}) {
  try {
    const response = await API.get("/admin/reports/enquiry", {
      params: buildReportParams(filters),
      responseType: "blob",
    });

    triggerBlobDownload(
      response.data,
      extractFilename(response, "enquiry-report.xlsx"),
    );
  } catch (error) {
    await throwReportError(error);
  }
}

/**
 * -> fetchEnrollmentAnalytics (GET /reports/enrollment-analytics)
 * ⚠️ CONFIRM THIS PATH against your routes file — this hits the JSON
 * controller (getEnrollmentAnalytics), NOT the /reports/enrollment blob
 * export above. They are two different endpoints/controllers.
 *
 * Query: from_month, from_year, to_month, to_year, course_id — all
 * optional (controller defaults to Jan–Dec current year if omitted).
 *
 * Returns: {
 *   course_wise_enrollment: [{ course_id, course, enrollment }],
 *   monthly_enrollment: [{ month, month_key, enrollment }],
 *   course_monthly_breakdown: [...],
 *   available_courses: [...],
 *   date_range: {...},
 *   total_enrollment: number
 * }
 */

export async function fetchEnrollmentAnalytics(filters = {}) {
  try {
    const response = await API.get("/admin/reports/enrollment-analytics", {
      params: buildReportParams(filters),
    });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to load analytics data.",
      { cause: error },
    );
  }
}
