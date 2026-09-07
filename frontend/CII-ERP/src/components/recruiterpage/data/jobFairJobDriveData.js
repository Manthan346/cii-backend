import { CalendarDays, RefreshCw, Presentation, Briefcase } from 'lucide-react';

/**
 * jobFairJobDriveData
 *
 * Mock data for the Job Fair / Job Drive section: the events list,
 * the top stat cards, event type/status style maps, and now also the
 * per-event candidate applications (`eventApplications`) shown when a
 * row's "View" is clicked, plus the style/option maps that view needs.
 */

export const placementStatCards = [
  { id: 'total-events', icon: CalendarDays, iconBg: '#f97316', value: 4, label: 'Total Events' },
  { id: 'upcoming', icon: RefreshCw, iconBg: '#c026d3', value: 3, label: 'Upcoming' },
  { id: 'job-fairs', icon: Presentation, iconBg: '#14b8a6', value: 2, label: 'Job Fairs' },
  { id: 'job-drives', icon: Briefcase, iconBg: '#3b82f6', value: 2, label: 'Job Drives' },
];

// Maps an event's `type` to the shared StatusBadge's bg/color props
export const eventTypeStyles = {
  'Job Fair': { bg: '#d1fae5', color: '#0f766e' },
  'Job Drive': { bg: '#ede9fe', color: '#7c3aed' },
};

// Maps an event's `status` to the shared StatusBadge's bg/color props.
// Status here is the event's timing/stage (has it happened yet?),
// not a publish state - matches the "All status" filter dropdown.
export const eventStatusStyles = {
  Upcoming: { bg: '#ede9fe', color: '#7c3aed' },
  Ongoing: { bg: '#dcfce7', color: '#16a34a' },
  Completed: { bg: '#eef1f7', color: '#6b7280' },
};

// The 3 selectable status values, shared by EventTable's editable
// StatusSelect and EventFilterBar's "All status" dropdown (which
// prepends its own "All status" option on top of these).
export const eventStatusOptions = ['Upcoming', 'Ongoing', 'Completed'];

// Maps a candidate application's `status` to the shared StatusBadge's bg/color props
export const applicationStatusStyles = {
  Selected: { bg: '#dcfce7', color: '#16a34a' },
  Rejected: { bg: '#fee2e2', color: '#dc2626' },
  Interview: { bg: '#dbeafe', color: '#2563eb' },
};

// Dropdown options for ApplicationsFilterBar's "All Status" / "All Sources" selects
export const applicationStatusOptions = ['All Status', 'Selected', 'Rejected', 'Interview'];
export const applicationSourceOptions = ['All Sources', 'Registered Online', 'Walk-in'];

const SHARED_APPLICATION_STATS = { registered: 100, attended: 80, shortlisted: 60, interviewed: 40, selected: 20 };

export const placementEvents = [
  {
    id: 'event-1',
    name: 'North Mumbai Job Fair',
    type: 'Job Fair',
    date: '15 Jun 2026',
    time: '9:00 AM – 12:00 PM',
    venue: 'Community Hall, Andheri',
    address: 'Community Hall, Andheri West, Mumbai, Maharashtra',
    mapsLink: 'https://maps.google.com/',
    candidates: 200,
    candidatesRegistered: '300+',
    status: 'Upcoming',
    postedDate: '2026-07-28',
    description: 'Multi-company hiring fair covering hospitality, design and beauty & wellness roles for graduating batches.',
    applicationStats: SHARED_APPLICATION_STATS,
  },
  {
    id: 'event-2',
    name: 'ITC Hospitality Drive',
    type: 'Job Drive',
    date: '15 Jun 2026',
    time: '9:00 AM – 12:00 PM',
    venue: 'ITC Grand Central, Recruitment Center',
    address: 'ITC Grand Central, Parel, Mumbai, Maharashtra',
    mapsLink: 'https://maps.google.com/',
    candidates: 150,
    candidatesRegistered: '150+',
    status: 'Ongoing',
    postedDate: '2026-07-20',
    description: 'On-site hiring drive for ITC hospitality roles across front office, F&B, and housekeeping.',
    applicationStats: SHARED_APPLICATION_STATS,
  },
  {
    id: 'event-3',
    name: 'VFS Global Walk-In Drive',
    type: 'Job Fair',
    date: '15 Jun 2026',
    time: '9:00 AM – 12:00 PM',
    venue: 'VFS Global Office',
    address: 'VFS Global Office, Andheri East, Mumbai, Maharashtra',
    mapsLink: 'https://maps.google.com/',
    candidates: 100,
    candidatesRegistered: '100+',
    status: 'Completed',
    postedDate: '2026-06-10',
    description: 'Walk-in interviews for VFS Global customer service and visa processing roles.',
    applicationStats: SHARED_APPLICATION_STATS,
  },
  {
    id: 'event-4',
    name: 'VFS Global Walk-In Drive',
    type: 'Job Drive',
    date: '15 Jun 2026',
    time: '9:00 AM – 12:00 PM',
    venue: 'VFS Global Office',
    address: 'VFS Global Office, Andheri East, Mumbai, Maharashtra',
    mapsLink: 'https://maps.google.com/',
    candidates: 100,
    candidatesRegistered: '100+',
    status: 'Completed',
    postedDate: '2026-07-30',
    description: 'Follow-up hiring drive for VFS Global roles, details still being finalized.',
    applicationStats: SHARED_APPLICATION_STATS,
  },
  {
    id: 'event-5',
    name: 'North Mumbai Job Fair',
    type: 'Job Fair',
    date: '15 Jun 2026',
    time: '9:00 AM – 12:00 PM',
    venue: 'Community Hall, Andheri',
    address: 'Community Hall, Andheri West, Mumbai, Maharashtra',
    mapsLink: 'https://maps.google.com/',
    candidates: 200,
    candidatesRegistered: '300+',
    status: 'Upcoming',
    postedDate: '2026-07-28',
    description: 'Second batch multi-company hiring fair covering hospitality, design and beauty & wellness roles.',
    applicationStats: SHARED_APPLICATION_STATS,
  },
];

/**
 * eventApplications
 *
 * Flat list of candidate applications, each tagged with the `eventId`
 * of the placement event they applied through. EventApplicationsView
 * filters this by the currently-viewed event's id.
 *
 * NOTE: `company` is plain text - the reference design shows a small
 * company logo next to it, but no logo assets were provided, so this
 * renders as a text chip instead. Swap in <img> tags once real logos
 * are available.
 *
 * `resumeUrl` is a placeholder link (example.com) - the Resume
 * column's "Preview" button opens it in a new tab as-is. Swap each
 * candidate's `resumeUrl` for the real hosted file URL once resumes
 * are actually stored somewhere; ApplicationsTable doesn't need to
 * change.
 */
export const eventApplications = [
  {
    id: 'app-1', eventId: 'event-1', name: 'Ankita Sharma', avatarColor: '#7c3aed',
    appliedTo: 'Junior Graphic Designer', company: 'COSMOS', contactNo: '+91 9999900000',
    email: 'ankita@mail.com', appliedDate: '17 Jul 2026', source: 'Registered Online', status: 'Selected', resumeUrl: 'https://example.com/resumes/app-1.pdf',
  },
  {
    id: 'app-2', eventId: 'event-1', name: 'Kiran Sawant', avatarColor: '#0f766e',
    appliedTo: 'Quick Service Restaurant', company: 'JUBILANT FoodWorks', contactNo: '+91 9999900000',
    email: 'kiran@mail.com', appliedDate: '17 Jul 2026', source: 'Walk-in', status: 'Rejected', resumeUrl: 'https://example.com/resumes/app-2.pdf',
  },
  {
    id: 'app-3', eventId: 'event-1', name: 'Suresh Naik', avatarColor: '#b45309',
    appliedTo: 'Beauty & Wellness', company: "L'Oréal India", contactNo: '+91 9999900000',
    email: 'suresh@mail.com', appliedDate: '17 Jul 2026', source: 'Walk-in', status: 'Selected', resumeUrl: 'https://example.com/resumes/app-3.pdf',
  },
  {
    id: 'app-4', eventId: 'event-1', name: 'Deepa Chavan', avatarColor: '#2563eb',
    appliedTo: 'Hospitality', company: 'ITC Hotels Limited', contactNo: '+91 9999900000',
    email: 'deepa@mail.com', appliedDate: '17 Jul 2026', source: 'Registered Online', status: 'Interview', resumeUrl: 'https://example.com/resumes/app-4.pdf',
  },
  {
    id: 'app-5', eventId: 'event-1', name: 'Rohit Shinde', avatarColor: '#7c3aed',
    appliedTo: 'Junior Graphic Designer', company: 'COSMOS', contactNo: '+91 9999900000',
    email: 'rohit@mail.com', appliedDate: '17 Jul 2026', source: 'Walk-in', status: 'Rejected', resumeUrl: 'https://example.com/resumes/app-5.pdf',
  },
  {
    id: 'app-6', eventId: 'event-1', name: 'Pooja Jadhav', avatarColor: '#0f766e',
    appliedTo: 'Cybersecurity', company: 'DSCI', contactNo: '+91 9999900000',
    email: 'pooja@mail.com', appliedDate: '17 Jul 2026', source: 'Registered Online', status: 'Interview', resumeUrl: 'https://example.com/resumes/app-6.pdf',
  },

  {
    id: 'app-7', eventId: 'event-2', name: 'Kiran Sawant', avatarColor: '#0f766e',
    appliedTo: 'Junior Graphic Designer', company: 'COSMOS', contactNo: '+91 9999900000',
    email: 'kiran@mail.com', appliedDate: '17 Jul 2026', source: 'Registered Online', status: 'Selected', resumeUrl: 'https://example.com/resumes/app-7.pdf',
  },
  {
    id: 'app-8', eventId: 'event-2', name: 'Ankita Sharma', avatarColor: '#7c3aed',
    appliedTo: 'Quick Service Restaurant', company: 'JUBILANT FoodWorks', contactNo: '+91 9999900000',
    email: 'ankita@mail.com', appliedDate: '17 Jul 2026', source: 'Walk-in', status: 'Rejected', resumeUrl: 'https://example.com/resumes/app-8.pdf',
  },
  {
    id: 'app-9', eventId: 'event-2', name: 'Suresh Naik', avatarColor: '#b45309',
    appliedTo: 'Beauty & Wellness', company: "L'Oréal India", contactNo: '+91 9999900000',
    email: 'suresh@mail.com', appliedDate: '17 Jul 2026', source: 'Walk-in', status: 'Selected', resumeUrl: 'https://example.com/resumes/app-9.pdf',
  },
  {
    id: 'app-10', eventId: 'event-2', name: 'Deepa Chavan', avatarColor: '#2563eb',
    appliedTo: 'Hospitality', company: 'ITC Hotels Limited', contactNo: '+91 9999900000',
    email: 'deepa@mail.com', appliedDate: '17 Jul 2026', source: 'Registered Online', status: 'Interview', resumeUrl: 'https://example.com/resumes/app-10.pdf',
  },
  {
    id: 'app-11', eventId: 'event-2', name: 'Rohit Shinde', avatarColor: '#7c3aed',
    appliedTo: 'Junior Graphic Designer', company: 'COSMOS', contactNo: '+91 9999900000',
    email: 'rohit@mail.com', appliedDate: '17 Jul 2026', source: 'Walk-in', status: 'Rejected', resumeUrl: 'https://example.com/resumes/app-11.pdf',
  },
  {
    id: 'app-12', eventId: 'event-2', name: 'Pooja Jadhav', avatarColor: '#0f766e',
    appliedTo: 'Cybersecurity', company: 'DSCI', contactNo: '+91 9999900000',
    email: 'pooja@mail.com', appliedDate: '17 Jul 2026', source: 'Registered Online', status: 'Interview', resumeUrl: 'https://example.com/resumes/app-12.pdf',
  },
];
