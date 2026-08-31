import { FileText, Star, Calendar, Briefcase, BadgeCheck } from 'lucide-react';

/**
 * notificationsData
 *
 * Mock data for the Notifications page: the notifications list, a
 * type -> icon badge color map, and a type -> category label map
 * (used in the detail modal's small uppercase eyebrow text).
 */

export const notificationTypeStyles = {
  application: { bg: '#dbeafe', color: '#2563eb' },
  shortlisted: { bg: '#dcfce7', color: '#16a34a' },
  interview: { bg: '#fee2e2', color: '#dc2626' },
  'job-opportunity': { bg: '#dbeafe', color: '#2563eb' },
  update: { bg: '#eef2ff', color: '#4f46e5' },
  'job-closing': { bg: '#dbeafe', color: '#2563eb' },
  'offer-accepted': { bg: '#16234e', color: '#ffffff' },
};

export const notificationCategoryLabels = {
  application: 'APPLICATION',
  shortlisted: 'SHORTLIST',
  interview: 'INTERVIEW',
  'job-opportunity': 'JOB OPPORTUNITY',
  update: 'UPDATE',
  'job-closing': 'JOB ALERT',
  'offer-accepted': 'OFFER',
};

export const notifications = [
  {
    id: 'notif-1',
    type: 'application',
    icon: FileText,
    title: 'New Application received',
    description: 'Aisha Kumar applied for Junior Graphic Designer.',
    time: '10 min ago',
    unread: true,
  },
  {
    id: 'notif-2',
    type: 'shortlisted',
    icon: Star,
    title: 'Candidate Shortlisted',
    description: 'Sneha Iyer selected for Video Editor.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 'notif-3',
    type: 'interview',
    icon: Calendar,
    title: 'Interview reminder',
    description: 'Interview with Karan Mehta at 2:30 PM tomorrow.',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: 'notif-4',
    type: 'job-closing',
    icon: Briefcase,
    title: 'Job closing soon',
    description: 'HR Coordinator posting closes in 2 days.',
    time: '8 hours ago',
    unread: false,
  },
  {
    id: 'notif-5',
    type: 'offer-accepted',
    icon: BadgeCheck,
    title: 'Candidate accepted the offer',
    description: 'Vikram Singh accepted the offer for Junior Graphic Designer.',
    time: '11 hours ago',
    unread: false,
  },
  {
    id: 'notif-6',
    type: 'application',
    icon: FileText,
    title: 'New Application received',
    description: 'Anjali Patil applied for Cyber Security Intern.',
    time: '20 hours ago',
    unread: false,
  },
];
