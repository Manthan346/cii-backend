// Dummy data for the four summary cards at the top of the Batch Management page.
// Replace this with an API response later, e.g. GET /api/batches/stats
export const batchStats = [
  {
    id: "total",
    label: "Total batches",
    value: 9,
    icon: "layers",
    tone: "blue",
  },
  {
    id: "active",
    label: "Active",
    value: 6,
    icon: "check",
    tone: "green",
  },
  {
    id: "completed",
    label: "Batches Completed",
    value: 14,
    icon: "completed",
    tone: "peach",
  },
  {
    id: "upcoming",
    label: "Upcoming",
    value: 1,
    icon: "repeat",
    tone: "gray",
  },
];
