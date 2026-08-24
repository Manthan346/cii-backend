import {
  LayoutGrid,
  Ticket,
  BarChart3,
  Briefcase,
  Star,
  ClipboardCheck,
  User,
  LogOut,
} from 'lucide-react';

/**
 * sidebarMenu
 *
 * Drives the mobilizer Sidebar via .map(). Unlike adminpage's grouped
 * shape ({ title, items: [...] }), this sidebar is a flat list with
 * a few item kinds mixed in - matching the reference design, which
 * has no section headers:
 *
 *  - Regular item:  { id, title, route, icon }
 *  - Divider:       { id, isDivider: true }
 *  - Expandable:    { id, title, icon, children: [{ id, title, route }] }
 *                    (currently just "Placement" -> Dashboard / Placement Event)
 *  - Action item:   { id, title, icon, isAction: true } (currently just Logout -
 *                    no route to navigate to, see Sidebar.jsx for how it's
 *                    rendered differently, and MobilizerLayout.jsx for where
 *                    the actual logout handler lives)
 *
 * Backend integration note:
 *  If certain items should be hidden per role/permission, filter this
 *  array before passing it down, rather than editing Sidebar itself.
 */
export const sidebarMenu = [
  { id: 'dashboard', title: 'Dashboard', route: '/mobilizer/dashboard', icon: LayoutGrid },
  { id: 'enquiries', title: 'Enquiries', route: '/mobilizer/enquiries', icon: Ticket },
  { id: 'report', title: 'Report', route: '/mobilizer/report', icon: BarChart3 },
  { id: 'divider-1', isDivider: true },
  {
    id: 'placement',
    title: 'Placement',
    icon: Briefcase,
    children: [
      { id: 'placement-dashboard', title: 'Dashboard', route: '/mobilizer/placement/dashboard' },
      { id: 'placement-event', title: 'Placement Event', route: '/mobilizer/placement/event' },
    ],
  },
  { id: 'divider-2', isDivider: true },
  { id: 'event', title: 'Event', route: '/mobilizer/events', icon: Star },
  { id: 'task', title: 'Task', route: '/mobilizer/tasks', icon: ClipboardCheck },
  { id: 'profile', title: 'Profile', route: '/mobilizer/profile', icon: User },
  { id: 'divider-3', isDivider: true },
  { id: 'logout', title: 'Logout', icon: LogOut, isAction: true },
];
