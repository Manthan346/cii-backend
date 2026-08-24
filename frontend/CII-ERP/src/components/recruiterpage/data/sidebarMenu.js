import {
  LayoutDashboard,
  Briefcase,
  UserCheck,
  Send,
  Bell,
  User,
  LogOut,
} from 'lucide-react';

/**
 * sidebarMenu (Recruiter)
 *
 * Drives RecruiterSidebar's `.map()` render - no menu items are
 * hardcoded in the component itself. Same flat-list shape as
 * mobilizerpage/data/sidebarMenu.js, extended with an `isHeading`
 * item type for the "MAIN" / "HIRING" section labels seen in the
 * recruiter dashboard reference screenshot.
 *
 * Item shapes:
 *  - { isHeading: true, title }              -> section label (MAIN, HIRING)
 *  - { isDivider: true }                     -> thin separator line
 *  - { isAction: true, icon, title }         -> click handler item (Logout)
 *  - { icon, title, route }                  -> plain nav link
 *  - { icon, title, children: [{ id, title, route }] } -> expandable parent (none for now)
 */
export const sidebarMenu = [
  { id: 'heading-main', isHeading: true, title: 'MAIN' },
  { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard, route: '/recruiter/dashboard' },
  { id: 'job-management', title: 'Job Management', icon: Briefcase, route: '/recruiter/job-management' },
   { id: 'applications', title: 'Applications', icon: Send, route: '/recruiter/applications' },

  { id: 'divider-1', isDivider: true },

  { id: 'heading-hiring', isHeading: true, title: 'HIRING' },
  { id: 'job-fair-job-drive', title: 'Job Fair / Job Drive', icon: UserCheck, route: '/recruiter/job-fair-job-drive' },
 

  { id: 'divider-2', isDivider: true },

  { id: 'notifications', title: 'Notifications', icon: Bell, route: '/recruiter/notifications' },
  { id: 'profile', title: 'Profile', icon: User, route: '/recruiter/profile' },
  { id: 'logout', title: 'Logout', icon: LogOut, isAction: true },
];

export default sidebarMenu;
