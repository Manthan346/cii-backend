import API from "../api.js";

const STATUS_LABELS = {
  CALL_RECIEVED: "Call Received",
  CENTER_VISITED: "Center Visited",
  CENTER_NOT_VISITED: "Center Not Visited",
  ENROLLED: "Enrolled",
  WRONG_NUMBER: "Wrong Number",
  CALL_BUSY: "Call Busy",
  CALL_DROPPED_OUT: "Call Dropped Out",
  DOCUMENT_VERIFICATION_PENDING: "Document Verification Pending",
  INTERESTED: "Interested",
  DOCUMENT_VERIFICATION_DONE: "Document Verification Done",
  NOT_CONNECTED: "Not Connected",
  CONNECTED: "Connected",
  COUNSELING_DONE: "Counseling Done",
  FOLLOW_UP_PENDING: "Follow Up Pending",
  NOT_INTERESTED: "Not Interested",
};

const STATUS_VALUES = {
  "Call Received": "CALL_RECIEVED",
  "Center Visited": "CENTER_VISITED",
  "Center Not Visited": "CENTER_NOT_VISITED",
  Enrolled: "ENROLLED",
  "Wrong Number": "WRONG_NUMBER",
  "Call Busy": "CALL_BUSY",
  "Call Dropped Out": "CALL_DROPPED_OUT",
  "Document Verification Pending": "DOCUMENT_VERIFICATION_PENDING",
  Interested: "INTERESTED",
  "Document Verification Done": "DOCUMENT_VERIFICATION_DONE",
  "Not Connected": "NOT_CONNECTED",
  Connected: "CONNECTED",
  "Counseling Done": "COUNSELING_DONE",
  "Follow Up Pending": "FOLLOW_UP_PENDING",
  "Not Interested": "NOT_INTERESTED",
};

export async function fetchEnquiryStats() {
  const response = await API.get("/mobilizer/enquiry-stats");
  const stats = response.data?.data;

  if (!Array.isArray(stats)) {
    throw new Error("Enquiry stats response has an invalid format");
  }

  return stats.map(({ label, count }) => ({ label, count }));
}

export async function fetchEnquiries(params = {}) {
  const response = await API.get("/mobilizer/enquiry-management", { params });
  const data = response.data?.data;
  const enquiries = Array.isArray(data) ? data : data?.enquiries;

  if (!Array.isArray(enquiries)) {
    throw new Error("Enquiries response has an invalid format");
  }

  const pagination = data?.pagination ?? {};
  return {
    enquiries: enquiries.map(normalizeEnquiry),
    pagination: {
      page: pagination.page ?? params.page ?? 1,
      limit: pagination.limit ?? params.limit ?? 20,
      totalEnquiries:
        pagination.totalEnquiries ?? pagination.total ?? enquiries.length,
      totalPages:
        pagination.totalPages ??
        (pagination.hasNextPage ? (params.page ?? 1) + 1 : 1),
      hasNextPage: pagination.hasNextPage ?? false,
    },
  };
}

export async function fetchEnquiryDetails(enquiryId) {
  const response = await API.get(`/mobilizer/enquiry/${enquiryId}`);
  const data = response.data?.data;
  return { ...normalizeEnquiryDetails(data?.enquiry ?? data), id: enquiryId };
}

export async function assignEnquiry(enquiryId, mobilizerId) {
  const response = await API.post(`/mobilizer/enquiry/${enquiryId}/assign`, {
    mobilizer_id: mobilizerId,
  });
  return response.data?.data;
}

export async function changeEnquiryStatus(enquiryId, status) {
  const response = await API.patch(`/mobilizer/enquiry/${enquiryId}/status`, {
    status: STATUS_VALUES[status] ?? status,
  });
  return response.data?.data;
}

export function getEnquiryStatusValue(status) {
  return STATUS_VALUES[status] ?? status;
}

function normalizeEnquiry(enquiry) {
  const status = formatStatus(enquiry.enq_status ?? enquiry.status);
  const firstName =
    enquiry.enquiry_first_name ??
    enquiry.firstName ??
    enquiry.name?.split(" ")[0] ??
    "Unknown";
  const lastName =
    enquiry.enquiry_last_name ??
    enquiry.lastName ??
    enquiry.name?.split(" ").slice(1).join(" ") ??
    "";

  return {
    ...enquiry,
    id: enquiry.enquiry_id ?? enquiry.id,
    firstName,
    lastName,
    area: enquiry.enquiry_location ?? enquiry.area ?? "-",
    enquirySource: enquiry.enquiry_source ?? enquiry.enquirySource ?? "-",
    enquiryDate: formatDate(enquiry.created_at ?? enquiry.enquiryDate),
    contact: enquiry.enquiry_phone_no ?? enquiry.contact ?? "-",
    email: enquiry.enquiry_email ?? enquiry.email ?? "-",
    education: enquiry.enquiry_education ?? enquiry.education ?? "-",
    status,
    avatarTone: "navy",
    timeline: [],
  };
}

function normalizeEnquiryDetails(enquiry) {
  if (!enquiry) return null;

  const candidate = normalizeEnquiry(enquiry);
  const profile = enquiry.candidate_profile;
  const contact = enquiry.contact_details;
  const history =
    enquiry.status_history ?? enquiry.enquiry_status_history ?? [];

  return {
    ...candidate,
    firstName: profile?.name?.split(" ")[0] ?? candidate.firstName,
    lastName:
      profile?.name?.split(" ").slice(1).join(" ") ?? candidate.lastName,
    status: formatStatus(
      enquiry.enq_status ?? enquiry.status ?? profile?.verification_status,
    ),
    contact: contact?.phone ?? candidate.contact,
    email: contact?.email ?? candidate.email,
    education: profile?.education ?? candidate.education,
    enquiryDate: profile?.enquiry_date ?? candidate.enquiryDate,
    timeline: history.map((entry) => ({
      event: formatStatus(entry.status ?? entry.enq_status),
      dotTone: statusTone(entry.status ?? entry.enq_status),
      date: entry.date ?? formatDate(entry.changed_at ?? entry.created_at),
      time: entry.time ?? formatTime(entry.changed_at ?? entry.created_at),
      by: entry.updateByMobilizer ?? entry.changed_by ?? "Unknown",
      location: entry.location ?? "-",
    })),
  };
}

function formatStatus(status) {
  const normalizedStatus = String(status ?? "").toUpperCase();
  return STATUS_LABELS[normalizedStatus] ?? status ?? "Pending";
}

function statusTone(status) {
  const normalizedStatus = String(status ?? "").toUpperCase();
  if (["ENROLLED", "DOCUMENT_VERIFICATION_DONE", "COUNSELING_DONE"].includes(normalizedStatus)) return "green";
  if (["WRONG_NUMBER", "CALL_DROPPED_OUT", "NOT_INTERESTED"].includes(normalizedStatus)) return "red";
  if (["CENTER_VISITED", "CONNECTED"].includes(normalizedStatus)) return "blue";
  if (["CALL_BUSY", "FOLLOW_UP_PENDING", "DOCUMENT_VERIFICATION_PENDING"].includes(normalizedStatus)) return "amber";
  return "navy";
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
