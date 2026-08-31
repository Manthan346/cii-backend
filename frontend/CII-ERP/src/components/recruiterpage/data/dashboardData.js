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
  { id: 'total-job-applications', metric: 'totalJobApplications', icon: FileInput, iconBg: '#f97316', label: 'Total Applications' },
  { id: 'total-job-events', metric: 'totalJobEvents', icon: CalendarDays, iconBg: '#3b82f6', label: 'Total Job Events' },
  { id: 'upcoming-job-events', metric: 'upcomingJobEvents', icon: Hourglass, iconBg: '#ec4899', label: 'Upcoming Job Events' },
  { id: 'completed-job-events', metric: 'completedJobEvents', icon: CheckCircle2, iconBg: '#22c55e', label: 'Completed Job Events' },
  { id: 'shortlisted-students', metric: 'shortlistedStudents', icon: Star, iconBg: '#a855f7', label: 'Shortlisted Students' },
  { id: 'selected-students', metric: 'selectedStudents', icon: MonitorCheck, iconBg: '#14b8a6', label: 'Selected Students' },
  { id: 'current-jobs-posted', metric: 'currentJobsPosted', icon: Briefcase, iconBg: '#38bdf8', label: 'Current Jobs Posted' },
  { id: 'interviewed-candidates', metric: 'interviewedCandidates', icon: Lock, iconBg: '#6366f1', label: 'Interviewed Candidates' },
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

