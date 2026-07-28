// Dummy data for the Work page.
// Replace with API responses later, e.g.
//   GET /api/work/stats            -> workStats
//   GET /api/work/summary          -> workShortcuts
//   GET /api/work/recent-activity  -> recentActivity

// ---- Summary cards: Task assigned / Completed / Pending / Unread notification ----
export const workStats = [
  {
    id: "assigned",
    label: "Task assigned",
    value: 24,
    icon: "grid",
    tone: "blue",
  },
  {
    id: "completed",
    label: "Completed",
    value: 16,
    icon: "check",
    tone: "green",
  },
  {
    id: "pending",
    label: "Pending",
    value: 6,
    icon: "hourglass",
    tone: "blue",
  },
  {
    id: "unread",
    label: "Unread notification",
    value: 5,
    icon: "calendar",
    tone: "yellow",
  },
];

// ---- "Task Assigned" / "Notification" shortcut tiles ----
// `route` drives the click-through to the matching sidebar page
// (kept in sync with data/sidebarMenu.js).
export const workShortcuts = [
  {
    id: "task-assigned",
    icon: "clipboard",
    title: "Task Assigned",
    subtitle: "24 tasks . 6 pending",
    tone: "dark",
    route: "/staff/task-assigned",
  },
  {
    id: "notification",
    icon: "bell",
    title: "Notification",
    subtitle: "5 unread updates",
    tone: "mint",
    route: "/staff/notifications",
  },
];

// ---- "Recent activity" feed ----
// NOTE: "SQI essential week 5 slides" reproduces the label exactly as
// it appears in the reference design (same convention as "All braches"
// in data/filterOptions.js). Rename to "SQL" if that was a design typo.
export const recentActivity = [
  {
    id: "activity-1",
    icon: "file-check",
    title: 'Task Completed-"Upload CS-24 attendance sheet"',
    meta: "Marked complete by you . 2 hours ago",
  },
  {
    id: "activity-2",
    icon: "bell",
    title: 'New task assigned-"review python batch performance"',
    meta: "Assigned by admin . yesterday",
  },
  {
    id: "activity-3",
    icon: "layers",
    title: 'Study material uploaded-"SQI essential week 5 slides"',
    meta: "By karan bhosale . 3 day ago",
  },
];

// ---- Page-level meta (header subtitle, top-right button route) ----
export const workMeta = {
  subtitle: "your assign tasks and notifications at a glance",
  viewTaskRoute: "/staff/task-assigned",
  recentActivityRoute: "/staff/notifications",
};
