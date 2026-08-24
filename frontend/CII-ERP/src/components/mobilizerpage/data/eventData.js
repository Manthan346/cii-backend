// Data for the Events page.
// status: 'Upcoming' | 'Ongoing' | 'Completed'

export const eventStats = [
  { id: 'total', icon: 'FileText', value: 24, label: 'Total Events', iconTone: 'plain' },
  { id: 'upcoming', icon: 'FileEdit', value: 8, label: 'Upcoming Events', iconTone: 'plain' },
  { id: 'ongoing', icon: 'MessageSquare', value: 2, label: 'Ongoing Events', iconTone: 'plain' },
  { id: 'completed', icon: 'BadgeCheck', value: 14, label: 'Completed Events', iconTone: 'navy' },
];

export const eventTypeOptions = [
  { value: 'all', label: 'Event type' },
  { value: 'Seminar', label: 'Seminar' },
  { value: 'Webinar', label: 'Webinar' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Bootcamp', label: 'Bootcamp' },
  { value: 'Guest Visit', label: 'Guest Visit' },
];

export const eventTabs = ['All', 'Upcoming', 'Ongoing', 'Completed'];

export const events = [
  {
    id: 'ev-1',
    title: 'Industry Expert Guest Session',
    type: 'Guest Visit',
    day: '16',
    month: 'Aug',
    time: '11:00 AM - 2:00PM',
    status: 'Upcoming',
  },
  {
    id: 'ev-2',
    title: 'Cyber Security Career Webinar',
    type: 'Webinar',
    day: '20',
    month: 'Jul',
    time: '11:00 AM - 2:00PM',
    status: 'Completed',
  },
  {
    id: 'ev-3',
    title: 'Digital Skill Workshop',
    type: 'Workshop',
    day: '1',
    month: 'Jan',
    time: '11:00 AM - 2:00PM',
    status: 'Completed',
  },
  {
    id: 'ev-4',
    title: '3-day Nail Art Workshop',
    type: 'Workshop',
    day: '3',
    month: 'Sep',
    time: '11:00 AM - 2:00PM',
    status: 'Upcoming',
  },
  {
    id: 'ev-5',
    title: 'Resume Building Bootcamp',
    type: 'Bootcamp',
    day: '10',
    month: 'Oct',
    time: '10:00 AM - 1:00PM',
    status: 'Upcoming',
  },
  {
    id: 'ev-6',
    title: 'Placement Readiness Seminar',
    type: 'Seminar',
    day: '5',
    month: 'Nov',
    time: '2:00 PM - 4:00PM',
    status: 'Ongoing',
  },
  {
    id: 'ev-7',
    title: 'Fashion Design Guest Talk',
    type: 'Guest Visit',
    day: '22',
    month: 'Jun',
    time: '11:00 AM - 1:00PM',
    status: 'Completed',
  },
  {
    id: 'ev-8',
    title: 'AI Fundamentals Webinar',
    type: 'Webinar',
    day: '15',
    month: 'Feb',
    time: '3:00 PM - 5:00PM',
    status: 'Ongoing',
  },
];
