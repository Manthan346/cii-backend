// Initial notification data. NotificationsContext seeds its state from
// this array — from then on, read/unread status lives in that context
// (shared between the bell dropdown and the full Notifications page),
// not here.
// type: 'enquiry' | 'placement' | 'event' | 'task' | 'system'

export const notificationsData = [
  {
    id: 'nt-1',
    type: 'enquiry',
    title: 'New enquiry received',
    message: 'Rekha Patil submitted a new enquiry for Training from Kandivali west.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'nt-2',
    type: 'placement',
    title: 'Job fair starting tomorrow',
    message: 'North Mumbai Job Fair at CII Skill Centre starts tomorrow at 10:00 AM. 78 candidates are registered so far.',
    timestamp: '3 hours ago',
    read: false,
  },
  {
    id: 'nt-3',
    type: 'system',
    title: 'Documents pending review',
    message: '5 candidates have submitted documents that are still awaiting verification.',
    timestamp: '5 hours ago',
    read: false,
  },
  {
    id: 'nt-4',
    type: 'event',
    title: 'Event reminder',
    message: 'Cyber Security Career Webinar is happening today from 11:00 AM to 2:00 PM.',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 'nt-5',
    type: 'enquiry',
    title: 'Candidate status updated',
    message: 'Sneha More has been marked as Verified after her centre visit.',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 'nt-6',
    type: 'system',
    title: 'Weekly report is ready',
    message: 'Your weekly enrollment and placement summary report has been generated.',
    timestamp: '2 days ago',
    read: false,
  },
  {
    id: 'nt-7',
    type: 'task',
    title: 'Follow-up task assigned',
    message: 'You have been assigned to follow up with 3 candidates who visited the centre this week.',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: 'nt-8',
    type: 'placement',
    title: 'Selections completed',
    message: '45 candidates were selected out of 60 attended at the Community Hall, Malad job fair.',
    timestamp: '4 days ago',
    read: true,
  },
];
