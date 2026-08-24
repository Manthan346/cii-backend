import {
  LayoutGrid,
  Users,
  IdCard,
  BookOpen,
  BarChart3,
  Settings,
  User,
  RotateCcw,
  LogOut,
} from 'lucide-react';

/**
 * sidebarMenu
 *
 * Drives the admin Sidebar via .map() - no hardcoded nav items live
 * in the component itself. Mirrors the shape used in trainerpage/data
 * so the two Sidebars stay structurally consistent:
 *   { title, items: [{ id, title, route, icon }] }
 *
 * Backend integration note:
 *  If certain sections should be hidden per role/permission, filter
 *  this array (or the `items` inside a group) before passing it down,
 *  rather than editing the Sidebar component itself.
 */
export const sidebarMenu = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', title: 'Dashboard', route: '/admin/dashboard', icon: LayoutGrid },
      { id: 'total-users', title: 'Total Users', route: '/admin/total-users', icon: Users },
      { id: 'candidates', title: 'Candidates', route: '/admin/candidates', icon: IdCard },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'course-management', title: 'Course Management', route: '/admin/course-management', icon: BookOpen },
      { id: 'reports-analytics', title: 'Reports & Analytics', route: '/admin/reports-analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      // { id: 'system-settings', title: 'System Settings', route: '/admin/settings', icon: Settings },
      { id: 'profile', title: 'Profile', route: '/admin/profile', icon: User },
      { id: 'approval-requests', title: 'Approval Requests', route: '/admin/approval-requests', icon: RotateCcw },
    ],
  },
   {
    items: [
      { id: 'logout', title: 'Logout', route: '/admin/logout', icon: LogOut },
    ],
  },
];
