import { Users, UserCheck, CheckCircle2, ClipboardX } from 'lucide-react';

/**
 * data/candidatesData.js
 *
 * Mock data for the Candidates page and its section components
 * (CandidatesOverview, CandidatesFilterBar, CandidatesTable).
 *
 * Backend integration note:
 *  Each block below maps to one endpoint. Replace with fetched state
 *  (e.g. via a useCandidates() hook that also owns search/filter/page
 *  state) and keep the same shape so the section components don't
 *  need to change. Suggested endpoints noted per block.
 */

// GET /api/admin/candidates/summary
export const candidateStats = [
  {
    id: 'total-candidates',
    label: 'Total Candidates',
    value: '3,950',
    icon: Users,
    iconBg: '#5B7CFA',
    trendValue: '+3.1 %',
    trendDirection: 'up',
  },
  {
    id: 'active-candidates',
    label: 'Active Candidates',
    value: '2,870',
    icon: UserCheck,
    iconBg: '#34D399',
    trendValue: '+1.8 %',
    trendDirection: 'up',
  },
  {
    id: 'course-completed',
    label: 'Course Completed',
    value: '1,070',
    icon: CheckCircle2,
    iconBg: '#60A5FA',
    trendValue: '+5.4 %',
    trendDirection: 'up',
  },
  {
    id: 'inactive-candidates',
    label: 'Inactive candidates',
    value: '12',
    icon: ClipboardX,
    iconBg: '#F87171',
    // no trend line for this tile in the reference design
  },
];

// GET /api/admin/courses (for the Course filter)
export const candidateCourseOptions = [
  { value: 'all', label: 'All courses' },
  { value: 'ux-design', label: 'UX Design' },
  { value: 'fashion-designing', label: 'Fashion Designing' },
  { value: 'cyber-security', label: 'Cyber security' },
  { value: 'house-keeping', label: 'House keeping' },
  { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
];

// GET /api/admin/companies (for the Company filter)
export const candidateCompanyOptions = [
  { value: 'all', label: 'All Companies' },
];

// Static - filters the Attendance dropdown
export const candidateAttendanceOptions = [
  { value: 'all', label: 'All Attendance' },
  { value: 'high', label: 'Above 70%' },
  { value: 'mid', label: '40% - 69%' },
  { value: 'low', label: 'Below 40%' },
];

// Static - filters the Certificates dropdown
export const candidateCertificateOptions = [
  { value: 'all', label: 'All' },
  { value: 'issued', label: 'Issued' },
  { value: 'not-issued', label: 'Not Issued' },
];

// GET /api/admin/candidates?search=&course=&company=&attendance=&certificates=&page=
export const candidatesList = [
  {
    id: 'can-1042',
    candidateId: 'CAN-1042',
    name: 'Nisha sharma',
    course: 'UX Design',
    batch: 'CS-21',
    attendance: 79,
    certificate: 'not-issued',
  },
  {
    id: 'can-1044-a',
    candidateId: 'CAN-1044',
    name: 'pratik sharma',
    course: 'Fashion Designing',
    batch: 'CS-20',
    attendance: 20,
    certificate: 'issued',
  },
  {
    id: 'can-1044-b',
    candidateId: 'CAN-1044',
    name: 'rahul patil',
    course: 'Cyber security',
    batch: 'CS-24',
    attendance: 50,
    certificate: 'issued',
  },
  {
    id: 'can-1044-c',
    candidateId: 'CAN-1044',
    name: 'soham jadhav',
    course: 'House keeping',
    batch: 'CS-20',
    attendance: 80,
    certificate: 'not-issued',
  },
  {
    id: 'can-1044-d',
    candidateId: 'CAN-1044',
    name: 'Nishita patil',
    course: 'Artificial Intelligence',
    batch: 'CS-24',
    attendance: 30,
    certificate: 'issued',
  },
  {
    id: 'can-1044-e',
    candidateId: 'CAN-1044',
    name: 'ishaa sharma',
    course: null,
    batch: null,
    attendance: null,
    certificate: null,
  },
];

// Drives the "Showing 1-5 of 3950 Users" + pager footer
export const candidatesPagination = {
  currentPage: 1,
  totalPages: 964,
  pageSize: 5,
  totalResults: 3950,
};
