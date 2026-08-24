// Data for the Reports & Analytics page.
// Swap these arrays for live API data whenever the backend is wired up —
// every chart component below just expects this same shape.

export const candidateGrowthData = [
  { label: 'Feb', value: 3200 },
  { label: 'Mar', value: 3350 },
  { label: 'Apr', value: 3180 },
  { label: 'May', value: 3620 },
  { label: 'Jun', value: 3450 },
  { label: 'Jul', value: 3980 },
];

export const candidateGrowthConfig = {
  yMin: 3000,
  yMax: 4000,
  yStep: 200,
};

// tone maps to a CSS class in DonutChart.css (tone-blue / tone-black / tone-gray)
// so colors stay themeable from one place instead of being hard-coded per page.
export const placementStatsData = [
  { label: 'Placed', value: 55, tone: 'blue' },
  { label: 'In progress', value: 25, tone: 'black' },
  { label: 'Not placed', value: 20, tone: 'gray' },
];

export const courseEnrollmentData = [
  { label: ['Artificial', 'intelligence'], value: 78 },
  { label: ['Cyber', 'Security'], value: 92 },
  { label: ['House', 'keeping'], value: 62 },
  { label: ['Fashion &', 'Beauty'], value: 85 },
];

export const courseEnrollmentConfig = {
  yMin: 0,
  yMax: 100,
  yStep: 20,
};

export const monthlyAdmissionsData = [
  { label: 'Feb', value: 62 },
  { label: 'Mar', value: 55 },
  { label: 'Apr', value: 68 },
  { label: 'May', value: 72 },
  { label: 'Jun', value: 80 },
  { label: 'Jul', value: 95 },
];

export const monthlyAdmissionsConfig = {
  yMin: 0,
  yMax: 100,
  yStep: 20,
};

export const reportsCourseOptions = [
  { value: 'all', label: 'ALL Courses' },
  { value: 'ai', label: 'Artificial Intelligence' },
  { value: 'cyber-security', label: 'Cyber Security' },
  { value: 'housekeeping', label: 'House Keeping' },
  { value: 'fashion-beauty', label: 'Fashion & Beauty' },
];
