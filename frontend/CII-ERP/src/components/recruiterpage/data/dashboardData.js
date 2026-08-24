import {
  CalendarDays,
  CheckCircle2,
  Briefcase,
  Lock,
  FileInput,
  Hourglass,
  Star,
  MonitorCheck,
} from 'lucide-react';

/**
 * dashboardData
 *
 * Static/mock data for the Recruiter Dashboard, split into the pieces
 * each dashboard sub-component consumes. Wire these up to real API
 * responses later - the components only care about the shapes below,
 * not where the data comes from.
 */

// Top stat cards (2 rows x 4 cards)
export const statCards = [
  { id: 'total-job-events', icon: CalendarDays, iconBg: '#3b82f6', value: 4, label: 'Total Job Events' },
  { id: 'completed-job-event', icon: CheckCircle2, iconBg: '#ec4899', value: 2, label: 'Completed Job Event' },
  { id: 'total-job', icon: Briefcase, iconBg: '#22c55e', value: 25, label: 'Total Job' },
  { id: 'closed-job', icon: Lock, iconBg: '#38bdf8', value: 25, label: 'Closed Job' },
  { id: 'total-applications', icon: FileInput, iconBg: '#f97316', value: 4, label: 'Total Applications' },
  { id: 'pending-candidate-process', icon: Hourglass, iconBg: '#ec4899', value: 2, label: 'Pending Candidate Process' },
  { id: 'selected-candidates', icon: Star, iconBg: '#a855f7', value: 25, label: 'Selected Candidates' },
  { id: 'hired-candidates', icon: MonitorCheck, iconBg: '#14b8a6', value: 25, label: 'Hired Candidates' },
];

// "Applications per job" bar chart
export const applicationsPerJob = [
  { job: 'Hotel Management', value: 90 },
  { job: 'Graphic Design', value: 80 },
  { job: 'Cyber Security', value: 95 },
  { job: 'Fashion Designing', value: 60 },
  { job: 'Beauty & Wellness', value: 50 },
];

// "Applications by status" donut chart + legend
export const applicationsByStatus = [
  { status: 'Applied', value: 33, color: '#2547f4' },
  { status: 'Screening', value: 11, color: '#7dd3fc' },
  { status: 'Shortlisted', value: 17, color: '#22c55e' },
  { status: 'Interview scheduled', value: 13, color: '#f97316' },
  { status: 'Selected', value: 17, color: '#a855f7' },
  { status: 'Rejected', value: 9, color: '#ef4444' },
];

// Recent Activity feed
export const recentActivity = [
  { id: 1, text: 'Aisha Sheikh applied for Cyber Security', time: '1 hour ago' },
  { id: 2, text: 'Sneha Iyer shortlisted for Graphic Design', time: '1 hour ago' },
  { id: 3, text: 'Interview scheduled with Karan Mehta', time: '3 hour ago' },
  { id: 4, text: 'Hotel Management job published', time: 'Yesterday' },
  { id: 5, text: 'UI/UX Intern posting is closing soon', time: '2 days ago' },
];

// Hiring Progress funnel bars
export const hiringProgress = [
  { id: 'applied', stage: 'Applied', count: 13, percent: 20 },
  { id: 'screening', stage: 'Screening', count: 11, percent: 15 },
  { id: 'shortlisted', stage: 'Shortlisted', count: 17, percent: 20 },
  { id: 'interview-scheduled', stage: 'Interview scheduled', count: 12, percent: 15 },
  { id: 'selected', stage: 'Selected', count: 17, percent: 30 },
];
