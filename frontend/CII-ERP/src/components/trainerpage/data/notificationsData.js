// Dummy data for the Notifications page.
// Replace with API responses later, e.g.
//   GET /api/notifications/summary  -> notificationTabs, notificationMeta
//   GET /api/notifications          -> notificationRecords

// ---- Filter tabs: All / Unread / Task / Resources / System ----
// `count` is optional - only "All" and "Unread" show a number pill in
// the reference design; Task/Resources/System are plain filter chips.
export const notificationTabs = [
  { id: 'all', label: 'All', count: 18 },
  { id: 'unread', label: 'Unread', count: 5 },
  { id: 'task', label: 'Task' },
  { id: 'resources', label: 'Resources' },
  { id: 'system', label: 'System' },
];

// ---- Page-level meta (header subtitle) ----
export const notificationMeta = {
  unreadCount: 5,
};

// ---- "Recent Notifications" list ----
// category matches the filter tab ids above ("task" | "resources" | "system")
// so NotificationList can filter records by the active tab.
export const notificationRecords = [
  {
    id: 'notif-1',
    icon: 'clipboard',
    category: 'task',
    title: 'New task assigned-"review cyber security batch performance"',
    meta: 'Assigned by admin . 2 hours ago',
    unread: true,
  },
  {
    id: 'notif-2',
    icon: 'calendar',
    category: 'task',
    title: 'task overdue -"prepare Ai quiz"',
    meta: 'was due 5 jul 2026 . 1 day ago',
    unread: true,
  },
  {
    id: 'notif-3',
    icon: 'plus',
    category: 'resources',
    title: 'new study material uploaded by sneha deshmukh',
    meta: 'data science module 1 . 1 day ago',
    unread: true,
  },
  {
    id: 'notif-4',
    icon: 'plus',
    category: 'resources',
    title: 'new study material uploaded by mohit sharma',
    meta: 'data science module 1 . 2 day ago',
    unread: false,
  },
  {
    id: 'notif-5',
    icon: 'calendar',
    category: 'task',
    title: 'task overdue -"prepare CS quiz"',
    meta: 'was due 5 jul 2026 . 1 day ago',
    unread: false,
  },
];
