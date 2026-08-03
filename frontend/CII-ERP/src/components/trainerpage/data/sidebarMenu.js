/**
 * sidebarMenu.js
 *
 * Single source of truth for the Sidebar navigation.
 * The Sidebar renders this array with `.map()` — add, remove, reorder,
 * or relabel a menu item here only, never inside Sidebar.jsx.
 *
 * Shape:
 * {
 *   id: string        -> stable key, also matched against the current route
 *   title: string      -> visible label
 *   icon: LucideIcon   -> icon component reference (sized/colored centrally in Sidebar)
 *   route: string      -> path used by react-router's NavLink
 * }
 *
 * Backend integration note:
 *   If menu items ever need to come from an API (e.g. role-based menus),
 *   fetch that response into this same shape and the Sidebar needs no changes.
 */

import {
  LayoutGrid,
  Users,
  Layers,
  Calendar,
  Boxes,
  Upload,
  BarChart3,
  BriefcaseBusiness,
  ClipboardCheck,
  Bell,
  UserCircle,
  CalendarClock,
} from 'lucide-react';

export const sidebarMenu = [
  {
    title: 'WORKSPACE',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutGrid,
        route: '/trainer/dashboard',
      },
      {
        id: 'profile',
        title: 'Profile',
        icon: UserCircle,
        route: '/trainer/profile',
      },
      {
        id: 'candidate-management',
        title: 'Candidate Management',
        icon: Users,
        route: '/trainer/candidates',
      },
      {
        id: 'batch-management',
        title: 'Batch Management',
        icon: Layers,
        route: '/trainer/batch-management',
      },
      {
        id: 'attendance-management',
        title: 'Attendance Management',
        icon: Calendar,
        route: '/trainer/attendance',
      },
    ],
  },
  {
    title: 'RESOURCES',
    items: [
      // {
      //   id: 'resources',
      //   title: 'Resources',
      //   icon: Boxes,
      //   route: '/trainer/resources',
      // },
      {
        id: 'study-material-upload',
        title: 'Study Material Upload',
        icon: Upload,
        route: '/trainer/study-material',
      },
      // {
      //   id: 'reports',
      //   title: 'Reports',
      //   icon: BarChart3,
      //   route: '/trainer/reports',
      // },
    ],
  },
  {
    title: 'WORK',
    items: [
      {
        id: 'work',
        title: 'Work',
        icon: BriefcaseBusiness,
        route: '/trainer/work',
      },
      {
        id: 'events',
        title: 'Events',
        icon: CalendarClock,
        route: '/trainer/events',
      },
      {
        id: 'task-assigned',
        title: 'Task Assigned',
        icon: ClipboardCheck,
        route: '/trainer/task-assigned',
      },
      // {
      //   id: "notifications",
      //   title: "Notifications",
      //   icon: Bell,
      //   route: "/trainer/notifications",
      // },
    ],
  },
];

export default sidebarMenu;
