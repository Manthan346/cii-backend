import { Users, UserCheck, UserX, BadgePlus } from 'lucide-react';

/**
 * data/totalUsersData.js
 *
 * Mock data for the Total Users page and its section components
 * (UsersOverview, UsersFilterBar, UsersTable).
 *
 * Backend integration note:
 *  Each block below maps to one endpoint. Replace with fetched state
 *  (e.g. via a useTotalUsers() hook that also owns search/filter/page
 *  state) and keep the same shape so the section components don't
 *  need to change. Suggested endpoints noted per block.
 */

// GET /api/admin/users/summary
export const userStats = [
  {
    id: 'total-user',
    label: 'Total User',
    value: '4820',
    icon: Users,
    iconBg: '#5B7CFA',
    trendValue: '+4.2 %',
    trendDirection: 'up',
  },
  {
    id: 'active-user',
    label: 'Active User',
    value: '4316',
    icon: UserCheck,
    iconBg: '#34D399',
    trendValue: '+2.6 %',
    trendDirection: 'up',
  },
  {
    id: 'inactive-user',
    label: 'Inactive User',
    value: '504',
    icon: UserX,
    iconBg: '#F87171',
    trendText: 'no change',
  },
  {
    id: 'new-user',
    label: 'New User this month',
    value: '186',
    icon: BadgePlus,
    iconBg: '#F5B93D',
    trendValue: '+11.4 %',
    trendLabel: 'vs last month',
    trendDirection: 'up',
  },
];

// GET /api/admin/users/roles (for the Roles filter)
export const userRoleOptions = [
  { value: 'all', label: 'All roles' },
  { value: 'candidates', label: 'Candidates' },
  { value: 'trainer', label: 'Trainer' },
  { value: 'mobilizer', label: 'Mobilizer' },
  { value: 'admin', label: 'Admin' },
];

// Static - Active/Inactive filter for the Status dropdown
export const userStatusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// GET /api/admin/users?search=&role=&status=&page=&pageSize=
export const usersList = [
  {
    id: 'usr-1042',
    userId: 'USR-1042',
    name: 'Rohan sharma',
    email: 'rohan@gmail.com',
    mobile: '9856734562',
    role: 'candidates',
    roleLabel: 'candidates',
    status: 'active',
    lastLogin: 'mon 10pm',
  },
  {
    id: 'usr-1044-a',
    userId: 'USR-1044',
    name: 'pratik sharma',
    email: 'pratik4@gmail.com',
    mobile: '9856734562',
    role: 'trainer',
    roleLabel: 'Trainer',
    status: 'active',
    lastLogin: 'wed 9pm',
  },
  {
    id: 'usr-1044-b',
    userId: 'USR-1044',
    name: 'Pranjali mehta',
    email: 'pratik4@gmail.com',
    mobile: '9856734562',
    role: 'trainer',
    roleLabel: 'Trainer',
    status: 'active',
    lastLogin: 'thu 9pm',
  },
  {
    id: 'usr-1044-c',
    userId: 'USR-1044',
    name: 'Raj gaikwadh',
    email: 'pratik4@gmail.com',
    mobile: '9856734562',
    role: 'mobilizer',
    roleLabel: 'Mobilizer',
    status: 'active',
    lastLogin: 'mon 5pm',
  },
  {
    id: 'usr-1044-d',
    userId: 'USR-1044',
    name: 'pratik sharma',
    email: 'pratik4@gmail.com',
    mobile: '9856734562',
    role: 'trainer',
    roleLabel: 'Trainer',
    status: 'active',
    lastLogin: 'mon 4pm',
  },
  {
    id: 'usr-1044-e',
    userId: 'USR-1044',
    name: 'Pratik Jadhav',
    email: 'pratik4@gmail.com',
    mobile: '9856734562',
    role: 'candidates',
    roleLabel: 'Candidates',
    status: 'active',
    lastLogin: 'tue 4pm',
  },
];

// Drives the "Showing 1-5 of 4820 Users" + pager footer
export const usersPagination = {
  currentPage: 1,
  totalPages: 934,
  pageSize: 5,
  totalResults: 4820,
};
