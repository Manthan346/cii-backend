// Dummy option lists for the Create new Batch form's dropdown fields.
// Swap these for API-driven lists once the backend is connected
// (e.g. GET /api/courses, GET /api/rooms).

export const courseSelectOptions = [
  'eg Data Science-Batch 26',
  'Data Science',
  'Python programming',
  'Business comm.',
];

export const sessionTimeOptions = [
  'select time slot',
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
];

export const classroomOptions = [
  'Room 204-in-person',
  'Room 101-in-person',
  'Online - Zoom',
  'Hybrid',
];

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
