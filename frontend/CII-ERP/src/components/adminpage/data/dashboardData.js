import { Users, IdCard, UserCog, CalendarClock } from 'lucide-react';

/**
 * data/dashboardData.js
 *
 * Mock data for the admin Dashboard page and its section components
 * (StatsOverview, CandidateJourney, CoursePerformance,
 * ApprovalRequests).
 *
 * Backend integration note:
 *  Each block below maps to one endpoint. Replace with fetched state
 *  (e.g. via a useDashboardData() hook) and keep the same shape so the
 *  Dashboard component doesn't need to change - just swap the import
 *  for a hook call. Suggested endpoints noted per block.
 */

// GET /api/admin/dashboard/summary
export const summaryStats = [
  {
    id: 'total-users',
    label: 'Total User',
    value: '4,820',
    icon: Users,
    iconBg: '#8C7CF0',
    trendValue: '4.2%',
    trendDirection: 'up',
  },
  {
    id: 'total-candidates',
    label: 'Total Candidates',
    value: '3,950',
    icon: IdCard,
    iconBg: '#8C7CF0',
    trendValue: '3.1%',
    trendDirection: 'up',
  },
  {
    id: 'total-staff',
    label: 'Total staff',
    value: '210',
    icon: UserCog,
    iconBg: '#34D399',
    trendValue: '1.0%',
    trendDirection: 'up',
  },
  {
    id: 'monthly-enrollments',
    label: 'Monthly Enrollments',
    value: '385+',
    icon: CalendarClock,
    iconBg: '#FB923C',
    trendValue: '6.8%',
    trendDirection: 'up',
  },
];

// GET /api/admin/dashboard/candidate-journey
export const candidateJourney = [
  { id: 'enquiry', label: 'Enquiry', count: 1248, active: true },
  { id: 'registered', label: 'Registered', count: 850, active: true },
  { id: 'enrolled', label: 'Enrolled', count: 600, active: true },
  { id: 'training', label: 'Training', count: 450, active: false },
  { id: 'completed', label: 'Completed', count: 400, active: false },
  { id: 'certified', label: 'Certified', count: 400, active: false },
  { id: 'placed', label: 'Placed', count: 210, active: false },
];

// GET /api/admin/dashboard/course-performance
export const coursePerformance = [
  {
    id: 'graphic-design',
    course: 'Graphic Design',
    enrolled: 600,
    active: 520,
    yearlyTarget: '82%',
    certificates: 430,
  },
  {
    id: 'cyber-security',
    course: 'Cyber Security',
    enrolled: 300,
    active: 310,
    yearlyTarget: '91%',
    certificates: 290,
  },
  {
    id: 'housekeeping',
    course: 'Housekeeping',
    enrolled: 600,
    active: 610,
    yearlyTarget: '74%',
    certificates: 450,
  },
];

// GET /api/admin/dashboard/approval-requests?limit=3
export const approvalRequests = [
  {
    id: 'ux-12',
    request: 'New batch - UX-12',
    type: 'Course',
    submittedBy: 'R.Mehta',
    status: 'pending',
  },
  {
    id: 'candidate-91',
    request: 'Free Wavier Candidate #91',
    type: 'Finance',
    submittedBy: 'Accounts Head',
    status: 'pending',
  },
  {
    id: 'staff-onboarding',
    request: 'New staff onboarding',
    type: 'HR',
    submittedBy: 'HR Head',
    status: 'pending',
  },
];
