import { ClipboardList, BadgeCheck, XSquare } from 'lucide-react';

/**
 * data/approvalRequestsPageData.js
 *
 * Mock data for the full Approval Requests page (distinct from the
 * smaller `approvalRequests` preview array in dashboardData.js used
 * on the Dashboard's "Approval requests" widget - kept separate so
 * the two don't collide in the barrel export).
 *
 * Backend integration note:
 *  Each block below maps to one endpoint. Replace with fetched state
 *  (e.g. via a useApprovalRequests() hook that also owns page state)
 *  and keep the same shape so the section components don't need to
 *  change. Suggested endpoints noted per block.
 */

// GET /api/admin/approval-requests/summary
export const approvalStats = [
  {
    id: 'pending',
    label: 'Pending',
    value: '14',
    icon: ClipboardList,
    iconBg: '#5B7CFA',
    trendText: 'Awaiting Review',
  },
  {
    id: 'approved',
    label: 'Approved',
    value: '238',
    icon: BadgeCheck,
    iconBg: '#3E5FEB',
    trendValue: '+12 %',
    trendLabel: 'this Week',
    trendDirection: 'up',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    value: '19',
    icon: XSquare,
    iconBg: '#FB923C',
    // shown as a plain muted note rather than a green "up is good" trend,
    // since a rising rejection count isn't a positive signal
    trendText: '+2 % this Week',
  },
];

// GET /api/admin/approval-requests?page=
export const approvalRequestsList = [
  {
    id: 'req-3312',
    requestId: 'REQ-3312',
    type: 'Course',
    submittedBy: 'R.Mehta',
    date: '25 jun 2026',
    priority: 'high',
    status: 'pending',
    description:
      'New batch creation request for UX-12, starting next month at the mumbai center, requesting 30 seats',
  },
  {
    id: 'req-3309',
    requestId: 'REQ-3309',
    type: 'Finance',
    submittedBy: 'Accounts Head',
    date: '24 jun 2026',
    priority: 'medium',
    status: 'pending',
    description: 'Fee waiver request for candidate #91 - financial hardship case, pending document verification.',
  },
  {
    id: 'req-3301',
    requestId: 'REQ-3301',
    type: 'HR',
    submittedBy: 'HR Head',
    date: '23 jun 2026',
    priority: 'low',
    status: 'pending',
    description: 'New staff onboarding request for the Kandivali center - 1 trainer, 1 mobilizer.',
  },
  {
    id: 'req-3298',
    requestId: 'REQ-3298',
    type: 'Course',
    submittedBy: 'Sunita Kale',
    date: '22 jun 2026',
    priority: 'low',
    status: 'approved',
    description: 'Batch extension request for WD-08 by 2 weeks to accommodate the placement drive schedule.',
  },
  {
    id: 'req-3290',
    requestId: 'REQ-3290',
    type: 'Course',
    submittedBy: 'HR Head',
    date: '23 jun 2026',
    priority: 'medium',
    status: 'pending',
    description: 'Trainer reassignment request for DA-05 due to scheduling conflict.',
  },
  {
    id: 'req-3299',
    requestId: 'REQ-3299',
    type: 'Finance',
    submittedBy: 'Account Head',
    date: '23 jun 2026',
    priority: 'medium',
    status: 'approved',
    description: 'Budget approval for additional lab equipment for the Cyber Security batch.',
  },
];

// Drives the "Showing 1-5 of 14" + pager footer
export const approvalRequestsPagination = {
  currentPage: 1,
  totalPages: 10,
  pageSize: 5,
  totalResults: 14,
};
