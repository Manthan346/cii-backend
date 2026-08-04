// Single place to translate backend enums into UI concerns.

export const NOTIFICATION_TYPE_CONFIG = {
  // category: "job" (CATEGORY_MAP in candidate-getAllNotification.ts)
  JOB_OPPORTUNITY: { category: "Job", icon: "briefcase", color: "red" },
  RECRUITER_RESPONSE: { category: "Job", icon: "briefcase", color: "red" },
  INTERVIEW_SCHEDULED: { category: "Job", icon: "briefcase", color: "red" },

  // category: "academics"
  ACADEMIC: { category: "Academics", icon: "book", color: "blue" },
  ASSESSMENT_CREATED: { category: "Academics", icon: "book", color: "blue" },
  STUDY_MATERIAL_UPLOADED: {
    category: "Academics",
    icon: "book",
    color: "blue",
  },
  BATCH_ASSIGNED: { category: "Academics", icon: "users", color: "blue" },
  ATTENDANCE_CREATED: {
    category: "Academics",
    icon: "calendar",
    color: "blue",
  },
  CERTIFICATE_UPLOADED: {
    category: "Academics",
    icon: "shieldCheck",
    color: "blue",
  },

  // category: "examination"
  EXAMINATION: { category: "Examination", icon: "alertCircle", color: "green" },
  RESULT_PUBLISHED: {
    category: "Examination",
    icon: "checkCircle",
    color: "green",
  },

  // category: "events" — confirmed via real API response: Hackathon
  // notifications come through with several distinct notification_type
  // values depending on the action (created vs. updated vs. cancelled),
  // not just "EVENT_CREATED". Previously only EVENT_CREATED and
  // EVENT_SCHEDULED were mapped, so an "Updated" event notification fell
  // through to DEFAULT_CONFIG and showed as "System" on the card even
  // though its reference_type ("EVENT") correctly counted it under the
  // Events tab. Add any other variants here as they're confirmed from
  // real payloads.
  EVENT_CREATED: { category: "Events", icon: "star", color: "purple" },
  EVENT_UPDATED: { category: "Events", icon: "star", color: "purple" },
  EVENT_CANCELLED: { category: "Events", icon: "star", color: "purple" },
  EVENT_REMINDER: { category: "Events", icon: "star", color: "purple" },
  EVENT_SCHEDULED: { category: "Events", icon: "star", color: "purple" },

  // NOTE: no Finance notification_type exists in the backend's
  // CATEGORY_MAP yet. Anything not matched above falls back to
  // DEFAULT_CONFIG rather than crashing.
};

const DEFAULT_CONFIG = { category: "System", icon: "bell", color: "gray" };

// Fallback config keyed by reference_type, used when notification_type
// isn't (yet) in NOTIFICATION_TYPE_CONFIG above. reference_type is a
// smaller, more stable set of values than notification_type (which grows
// every time the backend adds a new action variant like _UPDATED/_CANCELLED),
// so this keeps cards from silently showing "System" just because a new
// notification_type variant hasn't been added to the map yet.
const REFERENCE_TYPE_FALLBACK_CONFIG = {
  JOB: { category: "Job", icon: "briefcase", color: "red" },
  INTERVIEW: { category: "Job", icon: "briefcase", color: "red" },
  EXAM: { category: "Examination", icon: "alertCircle", color: "green" },
  EXAMINATION: { category: "Examination", icon: "alertCircle", color: "green" },
  ASSESSMENT: { category: "Academics", icon: "book", color: "blue" },
  STUDY_MATERIAL: { category: "Academics", icon: "book", color: "blue" },
  EVENT: { category: "Events", icon: "star", color: "purple" },
};

export function getNotificationTypeConfig(notificationType, referenceType) {
  return (
    NOTIFICATION_TYPE_CONFIG[notificationType] ??
    REFERENCE_TYPE_FALLBACK_CONFIG[referenceType] ??
    DEFAULT_CONFIG
  );
}

// reference_type -> route to open when a notification is clicked.
// Adjust paths to match your actual router.
//
// FIX: this used to `switch` on reference_id (a UUID) instead of
// reference_type (the enum-like string, e.g. "EVENT", "ASSESSMENT").
// reference_id is now used only to build the URL, not to select the case.
export function buildNotificationLink(reference_type, reference_id) {
  if (!reference_type) return null;
  switch (reference_type) {
    case "JOB":
      return `/job-opportunities/${reference_id}`;
    case "INTERVIEW":
      return `/job-opportunities/interviews/${reference_id}`;
    case "EXAM":
    case "EXAMINATION":
      return `/assessments/${reference_id}`;
    case "ASSESSMENT":
      return `/assessments/${reference_id}`;
    case "STUDY_MATERIAL":
      return `/study-materials/${reference_id}`;
    case "EVENT":
      // ⚠️ Guessed route — confirm this matches wherever your router
      // actually renders a single event's detail page, then adjust.
      return `/events/${reference_id}`;
    default:
      return null;
  }
}

// Known reference_type values from the backend, used to build the
// reference-type filter dropdown in NotificationDashboard.
// Extend this list if the backend starts emitting new reference_type values.
export const REFERENCE_TYPE_OPTIONS = [
  { id: "ALL", label: "All" },
  { id: "JOB", label: "Job" },
  { id: "INTERVIEW", label: "Interview" },
  { id: "EXAM", label: "Exam" },
  { id: "EXAMINATION", label: "Examination" },
  { id: "ASSESSMENT", label: "Assessment" },
  { id: "STUDY_MATERIAL", label: "Study Material" },
  { id: "EVENT", label: "Event" },
];
