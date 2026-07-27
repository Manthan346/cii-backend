/**
 * sidebarMenu.js
 *
 * Single source of truth for the Mobilizer Sidebar navigation.
 * The Sidebar renders this array with `.map()` — add, remove, reorder,
 * or relabel a menu item here only, never inside Sidebar.jsx.
 *
 * Shape (flat item):
 * {
 *   id: string        -> stable key, also matched against the current route
 *   title: string     -> visible label
 *   icon: LucideIcon  -> icon component reference (sized/colored centrally in Sidebar)
 *   route: string     -> path used by react-router's NavLink
 * }
 *
 * Shape (expandable group, e.g. "Job Fair"):
 * {
 *   id: string
 *   title: string
 *   icon: LucideIcon
 *   children: [ { id, title, route } ]  -> rendered as a nested accordion list
 * }
 *
 * Backend integration note:
 *   If menu items ever need to come from an API (e.g. role-based menus),
 *   fetch that response into this same shape and the Sidebar needs no changes.
 */

import {
  LayoutGrid,
  FileText,
  UserPlus,
  Briefcase,
  Star,
  ClipboardList,
  UserCheck,
  UserCog,
  BarChart3,
  Download,
} from "lucide-react";

export const sidebarMenu = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutGrid,
    route: "/mobilizer/dashboard",
  },
  {
    id: "enquiries",
    title: "Enquiries",
    icon: FileText,
    route: "/mobilizer/enquiries",
  },
  {
    id: "enrollments",
    title: "Enrollments",
    icon: UserPlus,
    route: "/mobilizer/enrollments",
  },
  {
    id: "job-fair",
    title: "Job Fair",
    icon: Briefcase,
    children: [
      {
        id: "job-fair-dashboard",
        title: "Dashboard",
        route: "/mobilizer/job-fair/dashboard",
      },
      {
        id: "registration-forms",
        title: "Registration Forms",
        route: "/mobilizer/job-fair/registration-forms",
      },
      {
        id: "walk-in-registrations",
        title: "Walk-in Registrations",
        route: "/mobilizer/job-fair/walk-in-registrations",
      },
      {
        id: "recruiter-registrations",
        title: "Recruiter Registrations",
        route: "/mobilizer/job-fair/recruiter-registrations",
      },
      {
        id: "job-fair-reports",
        title: "Reports",
        route: "/mobilizer/job-fair/reports",
      },
      {
        id: "job-fair-export",
        title: "Export",
        route: "/mobilizer/job-fair/export",
      },
    ],
  },
  {
    id: "event",
    title: "Event",
    icon: Star,
    route: "/mobilizer/event",
  },
];

/* Icons re-exported so pages inside job-fair sub-routes can reuse them
   for their own headers/breadcrumbs without redefining the mapping. */
export const jobFairIcons = {
  dashboard: LayoutGrid,
  registrationForms: ClipboardList,
  walkIn: UserCheck,
  recruiter: UserCog,
  reports: BarChart3,
  export: Download,
};

export default sidebarMenu;
