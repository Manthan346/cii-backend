// adminCreateUserService.js
//
// Drop this alongside your existing `adminUsersService.js`
// (e.g. src/api/admin/adminCreateUserService.js) and point it at YOUR
// actual axios instance + route paths — the endpoints below are named
// placeholders (`/* TODO */`) since each role is wired to its own
// controller (adminCreateCandidate, createInstructorByAdmin,
// createHrByAdmin, createMobilizerByAdmin).
//
// If your project already has a shared axios client (the one used inside
// adminUsersService.js), swap `apiClient` below for that import instead of
// the bare fetch wrapper, and drop the withCredentials/baseURL lines.

// import API from "../axiosInstance";
import API from "../api";

const ADMIN_BASE = "/admin";
const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "/api";

async function request(path, { method = "POST", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include", // sends the admin auth cookie/session
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      payload?.message || payload?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

const getCollection = (response, key) => {
  const payload = response?.data;
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
};

// --- create user calls --------------------------------------------------
// Payload shapes below match each controller's req.body destructuring
// exactly — do not rename these keys without updating the controller too.

/**
 * -> createUser (POST /create/user)
 * The current backend controller uses candidate_name and contact_no.
 */
export const createAdminCandidate = (values) =>
  API.post("admin/candidates/create", {
    ...values,
    candidate_name: [values.first_name, values.last_name]
      .filter(Boolean)
      .join(" "),
    contact_no: values.contact_number,
    education: values.education ?? values.course_id,
  }).then((res) => res.data);

/**
 * -> createInstructorByAdmin  (POST /total-users/create-instructor)
 * body: { first_name, last_name, email, phone_no, password, gender,
 *         date_of_birth, specialization, experience_years, company_id }
 */
export const createAdminInstructor = (values) =>
  API.post(`${ADMIN_BASE}/total-users/create-instructor`, {
    ...values,
    experience_years:
      values.experience_years === "" || values.experience_years == null
        ? undefined
        : Number(values.experience_years),
  }).then((res) => res.data);

/**
 * -> createHrByAdmin
 * body: { first_name, last_name, email, phone_no, password,
 *         designation, company_id }
 */
export const createAdminHr = (values) =>
  API.post(`${ADMIN_BASE}/total-users/create-hr`, values).then(
    (res) => res.data,
  );

/**
 * -> createMobilizerByAdmin
 * body: { first_name, last_name, email, phone_no, password, designation }
 */
export const createAdminMobilizer = (values) =>
  API.post(`${ADMIN_BASE}/total-users/create-mobilizer`, values).then(
    (res) => res.data,
  );

// Single dispatch table used by AddUserModal so it doesn't need a switch.
export const CREATE_USER_HANDLERS = {
  candidate: createAdminCandidate,
  instructor: createAdminInstructor,
  hr: createAdminHr,
  mobilizer: createAdminMobilizer,
};

// --- dropdown data --------------------------------------------------------

/** Courses offered by the admin's center (for candidate.course_id) */
export const fetchAdminCourses = () =>
  API.get(`${ADMIN_BASE}/courses`).then((res) => getCollection(res, "courses"));

/** Active batches for a given course, scoped to the admin's center (candidate.batch_id) */
export const fetchAdminBatchesByCourse = (courseId) =>
  API.get(`${ADMIN_BASE}/batches`, {
    params: { courseId: courseId },
  }).then((res) => getCollection(res, "batches"));

/** Companies available to link an instructor/HR to (company_id) */
export const fetchAdminCompanies = () =>
  API.get(`${ADMIN_BASE}/total-users/companies`).then((res) =>
    getCollection(res, "companies"),
  );
