const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const daysAgo = (days, hour = 9) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

/**
 * Single source of truth for category -> badge/icon color.
 * Change a value here and every card + badge in that category updates.
 */
export const CATEGORY_COLORS = {
  Academics: 'blue',
  Examination: 'green',
  Finance: 'yellow',
  Job: 'red',
  System: 'gray',
};

/**
 * Single source of truth for actual route paths.
 * ⚠️ CONFIRM THESE MATCH YOUR ACTUAL <Route path="..."> VALUES IN App.jsx.
 * If a path here doesn't match, navigation will silently do nothing —
 * update the value here, nothing else needs to change.
 */
export const ROUTES = {
  ASSESSMENTS: '/progress/assessments',
  MY_COURSES: '/my-courses',
  JOB_OPPORTUNITIES: '/progress/jobopportunities',
  MY_PROFILE: '/my-profile',
};

/**
 * Single source of truth for category -> destination page.
 * Every notification in a category always opens the same page, e.g.
 * ANY "Job" notification opens Job Opportunities, regardless of wording.
 * Change a value here and every notification in that category updates.
 */
export const CATEGORY_ROUTES = {
  Job: ROUTES.JOB_OPPORTUNITIES,
  Examination: ROUTES.ASSESSMENTS,
  Academics: ROUTES.MY_COURSES,
  Finance: ROUTES.MY_PROFILE, // no dedicated Finance page yet — point elsewhere if you add one
  System: ROUTES.MY_PROFILE,
};

/**
 * Dummy notification data.
 * Shape mirrors the payload expected from GET /notifications, so swapping
 * this file out for a fetched API response requires no component changes.
 *
 * category : 'Academics' | 'Examination' | 'Finance' | 'Job' | 'System'
 * icon     : name must exist in components/shared/Icon/Icon.jsx PATHS map
 * color / link are derived from category via CATEGORY_COLORS / CATEGORY_ROUTES
 * below, so they can never drift out of sync per item.
 */
const RAW_NOTIFICATIONS = [
  {
    id: 'ntf-001',
    title: 'Assignment "SQL Basics" is due in 2 days',
    description: '',
    category: 'Examination',
    icon: 'clock',
    isUnread: true,
    createdAt: hoursAgo(1),
  },
  {
    id: 'ntf-002',
    title: 'New study material uploaded for Python for Data Analysis',
    description: '',
    category: 'Academics',
    icon: 'bookOpen',
    isUnread: false,
    createdAt: hoursAgo(3),
  },
  {
    id: 'ntf-003',
    title: 'Your application to Data Cover moved to Interview',
    description: '',
    category: 'Job',
    icon: 'jobs',
    isUnread: false,
    createdAt: hoursAgo(5),
  },
  {
    id: 'ntf-004',
    title: 'Fee receipt for July is now available for download',
    description: '',
    category: 'Finance',
    icon: 'download',
    isUnread: true,
    createdAt: daysAgo(1, 14),
  },
  {
    id: 'ntf-005',
    title: 'Reminder: Python lab session starts tomorrow at 10 AM',
    description: '',
    category: 'Academics',
    icon: 'upcomingClasses',
    isUnread: false,
    createdAt: daysAgo(1, 9),
  },
  {
    id: 'ntf-006',
    title: 'Your score for "Data Visualization Quiz" has been published',
    description: '',
    category: 'Examination',
    icon: 'checkCircle',
    isUnread: false,
    createdAt: daysAgo(1, 8),
  },
  {
    id: 'ntf-007',
    title: 'Certificate for Business Communication has been issued',
    description: '',
    category: 'Academics',
    icon: 'certificate',
    isUnread: true,
    createdAt: daysAgo(2, 14),
  },
  {
    id: 'ntf-008',
    title: '3 new job openings match your profile this week',
    description: '',
    category: 'Job',
    icon: 'jobs',
    isUnread: false,
    createdAt: daysAgo(2, 14),
  },
  {
    id: 'ntf-009',
    title: 'Your password was changed successfully',
    description: '',
    category: 'System',
    icon: 'shield',
    isUnread: false,
    createdAt: daysAgo(2, 14),
  },
  {
    id: 'ntf-010',
    title: 'Assignment "React Fundamentals" has been graded',
    description: '',
    category: 'Examination',
    icon: 'checkCircle',
    isUnread: false,
    createdAt: daysAgo(3, 11),
  },
  {
    id: 'ntf-011',
    title: 'New announcement posted in Data Analysis course',
    description: '',
    category: 'Academics',
    icon: 'alert',
    isUnread: false,
    createdAt: daysAgo(4, 10),
  },
  {
    id: 'ntf-012',
    title: 'Application to Frontend Developer role shortlisted',
    description: '',
    category: 'Job',
    icon: 'jobs',
    isUnread: false,
    createdAt: daysAgo(4, 16),
  },
  {
    id: 'ntf-013',
    title: 'Fee due reminder: ₹15,000 pending for August term',
    description: '',
    category: 'Finance',
    icon: 'pending',
    isUnread: false,
    createdAt: daysAgo(5, 9),
  },
  {
    id: 'ntf-014',
    title: 'Live doubt-clearing session rescheduled to Friday',
    description: '',
    category: 'Academics',
    icon: 'upcomingClasses',
    isUnread: false,
    createdAt: daysAgo(6, 15),
  },
  {
    id: 'ntf-015',
    title: 'Your profile was viewed by 4 recruiters this week',
    description: '',
    category: 'Job',
    icon: 'profile',
    isUnread: false,
    createdAt: daysAgo(7, 12),
  },
  {
    id: 'ntf-016',
    title: 'System maintenance scheduled for this weekend',
    description: '',
    category: 'System',
    icon: 'rotateCcw',
    isUnread: false,
    createdAt: daysAgo(8, 10),
  },
];

// Derive color + link from category so both stay perfectly consistent
// across every notification, now and as new ones get added later.
const notificationData = RAW_NOTIFICATIONS.map((notification) => ({
  ...notification,
  color: CATEGORY_COLORS[notification.category],
  link: CATEGORY_ROUTES[notification.category] ?? null,
}));

export default notificationData;
