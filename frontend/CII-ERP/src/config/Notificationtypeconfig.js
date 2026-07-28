// Single place to translate backend enums into UI concerns.
// PLACEHOLDER icon/color values — swap these for whatever NotificationCard
// actually expects once we can see that component (string key? lucide
// component? hex string? className?).

export const NOTIFICATION_TYPE_CONFIG = {
  // category: "job" (CATEGORY_MAP in candidate-getAllNotification.ts)
  JOB_OPPORTUNITY: { category: "Job", icon: "briefcase", color: "red" },
  RECRUITER_RESPONSE: { category: "Job", icon: "briefcase", color: "red" },
  INTERVIEW_SCHEDULED: { category: "Job", icon: "briefcase", color: "red" },

  // category: "academics"
  ACADEMIC: { category: "Academics", icon: "book", color: "blue" },
  ASSESSMENT_CREATED: { category: "Academics", icon: "book", color: "blue" },
  STUDY_MATERIAL_UPLOADED: { category: "Academics", icon: "book", color: "blue" },
  BATCH_ASSIGNED: { category: "Academics", icon: "users", color: "blue" },
  ATTENDANCE_CREATED: { category: "Academics", icon: "calendar", color: "blue" },
  CERTIFICATE_UPLOADED: { category: "Academics", icon: "shield-check", color: "blue" },

  // category: "examination"
  EXAMINATION: { category: "Examination", icon: "alert-circle", color: "green" },
  RESULT_PUBLISHED: { category: "Examination", icon: "check-circle", color: "green" },

  // NOTE: no Finance/System notification_types exist in the backend's
  // CATEGORY_MAP yet. Anything that isn't one of the types above falls
  // back to DEFAULT_CONFIG below rather than crashing.
};

const DEFAULT_CONFIG = { category: "System", icon: "bell", color: "gray" };

export function getNotificationTypeConfig(notificationType) {
  return NOTIFICATION_TYPE_CONFIG[notificationType] ?? DEFAULT_CONFIG;
}

// reference_type -> route to open when a notification is clicked.
// Adjust paths to match your actual router.
export function buildNotificationLink(reference_type, reference_id) {
  if (!reference_id) return null;
  switch (reference_type) {
    case "JOB":
      return `/job-opportunities/${reference_id}`;
    case "INTERVIEW":
      return `/job-opportunities/interviews/${reference_id}`;
    case "EXAM":
    case "EXAMINATION":
      return `/assessments/${reference_id}`;
    default:
      return null;
  }
}