// Data for the Placement Workspace Dashboard.
// status: 'Completed' | 'Upcoming' | 'Cancelled' | 'Today'
// `stats` is only present for Completed events — the detail popup shows
// an empty state instead when it's missing (Upcoming/Today/Cancelled).

export const jobFairEvents = [
  {
    id: 'jf-1',
    date: '01 Jun 2026',
    location: 'Community Hall, Malad',
    status: 'Completed',
    stats: { enrolled: 100, registered: 100, attended: 60, interviewCompleted: 50, selected: 45, rejected: 5 },
  },
  { id: 'jf-2', date: '30 Jul 2026', location: 'CII Skill Centre', status: 'Upcoming' },
  { id: 'jf-3', date: '28 Jul 2026', location: 'Town Hall', status: 'Upcoming' },
  { id: 'jf-4', date: '25 Jul 2026', location: 'CII Skill Centre', status: 'Today' },
  { id: 'jf-5', date: '26 Jul 2026', location: 'Municipal Ground', status: 'Cancelled' },
  { id: 'jf-6', date: '21 Jul 2026', location: 'Town Hall', status: 'Cancelled' },
  { id: 'jf-7', date: '23 Jul 2026', location: 'CII Skill Centre', status: 'Today' },
  { id: 'jf-8', date: '20 Jul 2026', location: 'Municipal Ground', status: 'Cancelled' },
  { id: 'jf-9', date: '28 Jul 2026', location: 'Town Hall', status: 'Cancelled' },
  {
    id: 'jf-10',
    date: '01 May 2026',
    location: 'Community Hall, Malad',
    status: 'Completed',
    stats: { enrolled: 80, registered: 78, attended: 50, interviewCompleted: 40, selected: 32, rejected: 8 },
  },
  {
    id: 'jf-11',
    date: '11 May 2026',
    location: 'Municipal Ground',
    status: 'Completed',
    stats: { enrolled: 65, registered: 64, attended: 42, interviewCompleted: 35, selected: 28, rejected: 7 },
  },
  {
    id: 'jf-12',
    date: '21 Jun 2026',
    location: 'Community Hall, Malad',
    status: 'Completed',
    stats: { enrolled: 90, registered: 88, attended: 55, interviewCompleted: 46, selected: 38, rejected: 8 },
  },
  {
    id: 'jf-13',
    date: '01 April 2026',
    location: 'Community Hall, Malad',
    status: 'Completed',
    stats: { enrolled: 70, registered: 69, attended: 44, interviewCompleted: 36, selected: 30, rejected: 6 },
  },
  {
    id: 'jf-14',
    date: '11 April 2026',
    location: 'Community Hall, Malad',
    status: 'Completed',
    stats: { enrolled: 75, registered: 73, attended: 48, interviewCompleted: 39, selected: 33, rejected: 6 },
  },
  {
    id: 'jf-15',
    date: '22 April 2026',
    location: 'Municipal Ground',
    status: 'Completed',
    stats: { enrolled: 60, registered: 58, attended: 38, interviewCompleted: 30, selected: 24, rejected: 6 },
  },
];

export const placementStatusOptions = [
  { value: 'all', label: 'Status' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Today', label: 'Today' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export const candidateStatusData = [
  { label: 'Attended Job Fair', value: 60, tone: 'green' },
  { label: 'No Show', value: 40, tone: 'red' },
];

export const qualificationData = [
  { label: 'SCC', value: 2 },
  { label: 'HSC', value: 75 },
  { label: 'ITI', value: 20 },
  { label: 'Diploma', value: 75 },
  { label: 'Graduate', value: 20 },
  { label: 'other', value: 2 },
];

export const qualificationConfig = { yMin: 0, yMax: 100, yStep: 20 };

export const recruiterOutcomeData = [
  { label: 'Interview', value: 82 },
  { label: 'Shortlisted', value: 58 },
  { label: 'Selected', value: 48 },
  { label: 'Rejected', value: 40 },
  { label: 'Pending', value: 15 },
  { label: 'Joined', value: 88 },
];

export const recruiterOutcomeConfig = { yMin: 0, yMax: 100, yStep: 20 };
