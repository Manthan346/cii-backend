// Dummy data for the four summary cards at the top of the Candidate List page.
// Replace this with an API response later, e.g. GET /api/candidates/stats
export const candidateStats = [
  {
    id: 'total',
    label: 'Total Candidate',
    value: 128,
    icon: 'user',
    tone: 'orange',
  },
  {
    id: 'active',
    label: 'Active Candidate',
    value: 109,
    icon: 'check',
    tone: 'green',
  },
  {
    id: 'ending',
    label: 'Ending soon',
    value: 14,
    icon: 'clock',
    tone: 'gray',
  },
  {
    id: 'dropped',
    label: 'Dropped out',
    value: 5,
    icon: 'phone',
    tone: 'blue',
  },
];
