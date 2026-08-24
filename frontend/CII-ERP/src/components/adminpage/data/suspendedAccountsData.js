import { Users } from 'lucide-react';

/**
 * data/suspendedAccountsData.js
 *
 * Mock data for the Suspended Accounts page (reached from Candidates
 * via the "Deactivated Account" button) and its section components
 * (SuspendedOverview, SuspendedFilterBar, SuspendedAccountsTable).
 *
 * Backend integration note:
 *  Each block below maps to one endpoint. Replace with fetched state
 *  (e.g. via a useSuspendedAccounts() hook that also owns filter/page
 *  state) and keep the same shape so the section components don't
 *  need to change. Suggested endpoints noted per block.
 */

// GET /api/admin/candidates/suspended/summary
export const suspendedStats = [
  {
    id: 'suspended-accounts',
    label: 'Suspended accounts',
    value: '15',
    icon: Users,
    iconBg: '#5B7CFA',
    trendValue: '+3.1 %',
    trendDirection: 'up',
  },
  {
    id: 'total-suspended-accounts',
    label: 'Total Suspended accounts',
    value: '30',
    icon: Users,
    iconBg: '#5B7CFA',
    // no trend line for this tile in the reference design
  },
];

// Static - Month filter pill
export const suspendedMonthOptions = [
  { value: 'all', label: 'Month' },
  { value: 'jan', label: 'January' },
  { value: 'feb', label: 'February' },
  { value: 'mar', label: 'March' },
];

// Static - Years filter pill
export const suspendedYearOptions = [
  { value: 'all', label: 'Years' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
];

// GET /api/admin/courses (Courses filter pill)
export const suspendedCourseOptions = [
  { value: 'all', label: 'Courses' },
  { value: 'ux-design', label: 'UX Design' },
  { value: 'fashion-designing', label: 'Fashion Designing' },
  { value: 'cyber-security', label: 'Cyber security' },
  { value: 'house-keeping', label: 'House keeping' },
  { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
];

// GET /api/admin/batches (Batch filter pill)
export const suspendedBatchOptions = [
  { value: 'all', label: 'Batch' },
  { value: 'batch-1', label: 'Batch 1' },
  { value: 'batch-2', label: 'Batch 2' },
  { value: 'batch-3', label: 'Batch 3' },
];

// GET /api/admin/candidates/suspended?month=&year=&course=&batch=&page=
export const suspendedAccountsList = [
  {
    id: 'can-1042',
    candidateId: 'CAN-1042',
    name: 'Rohan sharma',
    course: 'UX Design UX-12',
    batch: 'Batch 1',
    attendance: 79,
    center: 'kandivali',
  },
  {
    id: 'can-1044-a',
    candidateId: 'CAN-1044',
    name: 'pratik sharma',
    course: 'Fashion Designing',
    batch: 'Batch 3',
    attendance: 20,
    center: 'Mumbai',
  },
  {
    id: 'can-1044-b',
    candidateId: 'CAN-1044',
    name: 'rahul patil',
    course: 'Cyber security',
    batch: 'Batch 1',
    attendance: 50,
    center: 'pune',
  },
  {
    id: 'can-1044-c',
    candidateId: 'CAN-1044',
    name: 'soham jadhav',
    course: 'House keeping',
    batch: 'Batch 2',
    attendance: 80,
    center: 'Kandivali',
  },
  {
    id: 'can-1044-d',
    candidateId: 'CAN-1044',
    name: 'Nishita patil',
    course: 'Artificial Intelligence',
    batch: 'Batch 3',
    attendance: 30,
    center: 'mumbai',
  },
  {
    id: 'can-1044-e',
    candidateId: 'CAN-1044',
    name: 'ishaa sharma',
    course: null,
    batch: null,
    attendance: null,
    center: null,
  },
];

// Drives the "Showing 1-5 of 30 Users" + pager footer
export const suspendedAccountsPagination = {
  currentPage: 1,
  totalPages: 10,
  pageSize: 5,
  totalResults: 30,
};
