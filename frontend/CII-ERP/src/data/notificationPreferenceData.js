/**
 * Dummy notification preference data.
 * Shape mirrors the payload expected from GET /notification-preferences.
 */
const notificationPreferenceData = [
  {
    id: 'pref-assessment-deadlines',
    title: 'Assessment Deadlines',
    description: 'Quizzes, assignments, exams',
    enabled: false,
  },
  {
    id: 'pref-class-reminders',
    title: 'Class Reminders',
    description: 'Live sessions & schedule changes',
    enabled: false,
  },
  {
    id: 'pref-job-recommendation',
    title: 'Job Recommendation',
    description: 'New matches & application updates',
    enabled: false,
  },
  {
    id: 'pref-finance-fees',
    title: 'Finance & Fees',
    description: 'Receipts and due payments',
    enabled: false,
  },
  {
    id: 'pref-email-notification',
    title: 'Email Notification',
    description: 'Also send a copy to your inbox',
    enabled: false,
  },
];

export default notificationPreferenceData;
