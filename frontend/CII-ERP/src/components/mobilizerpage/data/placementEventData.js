// Data for the Placement Events page.
// One event list feeds BOTH Card View and List View — List View just
// reads `venue` (short) instead of `address` (full) for its column.
// status: 'Upcoming' | 'Cancelled' | 'Completed' | 'Today'

export const placementEventStats = [
  { id: 'total', icon: 'FileText', value: 1200, label: 'Total', sublabel: 'Placement Events', iconTone: 'plain', labelTone: 'plain' },
  { id: 'upcoming', icon: 'FileEdit', value: 100, label: 'Upcoming', sublabel: 'Placement events', iconTone: 'plain', labelTone: 'amber' },
  { id: 'completed', icon: 'BadgeCheck', value: 450, label: 'Completed', sublabel: 'Placement events', iconTone: 'navy', labelTone: 'green' },
  { id: 'cancelled', icon: 'Users', value: 150, label: 'Cancelled', sublabel: 'Placement Events', iconTone: 'navy', labelTone: 'red' },
];

export const eventTypeOptions = [
  { value: 'all', label: 'Event type' },
  { value: 'job-fair', label: 'Job Fair' },
  { value: 'walk-in', label: 'Walk-in Drive' },
];

export const locationOptions = [
  { value: 'all', label: 'Location' },
  { value: 'malad', label: 'Malad' },
  { value: 'kandivali', label: 'Kandivali' },
];

export const eventStatusOptions = [
  { value: 'all', label: 'Status' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Today', label: 'Today' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

// Same 6-event set your Card View screenshot showed (including its two
// repeated entries) — kept as literal duplicates rather than invented as
// unique, since that's exactly what the reference displayed. Flagging in
// case that repetition was a mockup placeholder rather than intentional.
export const placementEvents = [
  {
    id: 'pe-1',
    title: 'North Mumbai Job Fair',
    status: 'Upcoming',
    date: '01 Apr 2026',
    time: '10:00 AM-4:00 PM',
    address: 'Community Hall, Malad S.V. Road, malad west, Mumbai 400064',
    venue: 'Community Hall, Malad',
    expectedCandidates: 300,
    organizers: ['Sonal Ahire', 'Rakesh jadhav'],
    description: '',
  },
  {
    id: 'pe-2',
    title: 'Dahisor job Fair',
    status: 'Cancelled',
    date: '18 Apr 2026',
    time: '10:00 AM-4:00 PM',
    address: 'CII Skill centre, Link Road, kandivali west, Mumbai 400067',
    venue: 'CII Skill Centre',
    expectedCandidates: 450,
    organizers: ['Sonal Ahire'],
    description: '',
  },
  {
    id: 'pe-3',
    title: 'North Mumbai Job Fair',
    status: 'Completed',
    date: '28 March 2026',
    time: '10:00 AM-4:00 PM',
    address: 'Community Hall, Malad S.V. Road, malad west, Mumbai 400064',
    venue: 'Community Hall, Malad',
    expectedCandidates: 300,
    organizers: ['Sonal Ahire', 'Rakesh jadhav'],
    description: '',
    stats: { enrolled: 100, registered: 100, attended: 60, interviewCompleted: 50, selected: 45, rejected: 5 },
  },
  {
    id: 'pe-4',
    title: 'North Mumbai Job Fair',
    status: 'Upcoming',
    date: '01 Apr 2026',
    time: '10:00 AM-4:00 PM',
    address: 'Community Hall, Malad S.V. Road, malad west, Mumbai 400064',
    venue: 'Community Hall, Malad',
    expectedCandidates: 300,
    organizers: ['Sonal Ahire', 'Rakesh jadhav'],
    description: '',
  },
  {
    id: 'pe-5',
    title: 'Dahisor job Fair',
    status: 'Cancelled',
    date: '18 Apr 2026',
    time: '10:00 AM-4:00 PM',
    address: 'CII Skill centre, Link Road, kandivali west, Mumbai 400067',
    venue: 'CII Skill Centre',
    expectedCandidates: 450,
    organizers: ['Sonal Ahire'],
    description: '',
  },
  {
    id: 'pe-6',
    title: 'North Mumbai Job Fair',
    status: 'Completed',
    date: '28 March 2026',
    time: '10:00 AM-4:00 PM',
    address: 'Community Hall, Malad S.V. Road, malad west, Mumbai 400064',
    venue: 'Community Hall, Malad',
    expectedCandidates: 300,
    organizers: ['Sonal Ahire', 'Rakesh jadhav'],
    description: '',
    stats: { enrolled: 100, registered: 100, attended: 60, interviewCompleted: 50, selected: 45, rejected: 5 },
  },
];
