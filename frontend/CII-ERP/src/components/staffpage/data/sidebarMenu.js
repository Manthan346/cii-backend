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
} from "lucide-react";

export const sidebarMenu = [
  {
    title: "WORKSPACE",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: LayoutGrid,
        route: "/staff/dashboard",
      },
      {
        id: "candidate-management",
        title: "Candidate Management",
        icon: Users,
        route: "/staff/candidates",
      },
      {
        id: "batch-management",
        title: "Batch Management",
        icon: Layers,
        route: "/staff/batches",
      },
      {
        id: "attendance-management",
        title: "Attendance Management",
        icon: Calendar,
        route: "/staff/attendance",
      },
    ],
  },
  {
    title: "RESOURCES",
    items: [
      {
        id: "resources",
        title: "Resources",
        icon: Boxes,
        route: "/staff/resources",
      },
      {
        id: "study-material-upload",
        title: "Study Material Upload",
        icon: Upload,
        route: "/staff/study-material",
      },
      {
        id: "reports",
        title: "Reports",
        icon: BarChart3,
        route: "/staff/reports",
      },
    ],
  },
  {
    title: "WORK",
    items: [
      {
        id: "work",
        title: "Work",
        icon: BriefcaseBusiness,
        route: "/staff/work",
      },
    ],
  },
];

export default sidebarMenu;
