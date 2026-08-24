import { Layers, PlayCircle, ClipboardCheck } from 'lucide-react';

/**
 * data/courseManagementData.js
 *
 * Mock data for the Course Management page and its section components
 * (CourseManagementOverview, CoursesFilterBar, CoursesTable,
 * ShortTermFilterBar, ShortTermTrainingTable).
 *
 * Backend integration note:
 *  Each block below maps to one endpoint. Replace with fetched state
 *  (e.g. via a useCourseManagement() hook that also owns tab/filter/
 *  page state) and keep the same shape so the section components
 *  don't need to change. Suggested endpoints noted per block.
 */

// GET /api/admin/courses/summary
export const courseStats = [
  {
    id: 'total-courses',
    label: 'Total courses',
    value: '86',
    icon: Layers,
    iconBg: '#8C7CF0',
    trendValue: '+3',
    trendDirection: 'up',
  },
  {
    id: 'active-courses',
    label: 'Active courses',
    value: '64',
    icon: PlayCircle,
    iconBg: '#34D399',
    trendValue: '+1.6%',
    trendDirection: 'up',
  },
  {
    id: 'completed-courses',
    label: 'Completed courses',
    value: '8',
    icon: ClipboardCheck,
    iconBg: '#FB923C',
    trendValue: '+2',
    trendDirection: 'up',
  },
];

// ── Courses tab ──────────────────────────────────────────────────────

// GET /api/admin/batches (Batches filter)
export const courseBatchOptions = [
  { value: 'all', label: 'All batches' },
  { value: 'ux-12', label: 'UX-12' },
  { value: 'wd-08', label: 'WD-08' },
  { value: 'da-05', label: 'DA-05' },
  { value: 'dm-03', label: 'DM-03' },
];

// Static - Status filter
export const courseStatusOptions = [
  { value: 'all', label: 'ALL Statuses' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

// GET /api/admin/courses (Course filter)
export const courseNameOptions = [
  { value: 'all', label: 'All courses' },
  { value: 'ux-product-design', label: 'UX & Product Design' },
  { value: 'full-stack-web-development', label: 'Full-Stack Web Development' },
  { value: 'data-analytics-with-python', label: 'Data Analytics with Python' },
  { value: 'digital-marketing-fundamentals', label: 'Digital Marketing Fundamentals' },
];

// GET /api/admin/companies (Company filter)
export const courseCompanyOptions = [
  { value: 'all', label: 'All Companies' },
];

// GET /api/admin/courses?search=&batch=&status=&course=&company=&page=
export const coursesCatalogList = [
  {
    id: 'ux-12',
    name: 'UX & Product Design',
    batch: 'UX-12',
    duration: '12 weeks',
    batchSize: 30,
    startDate: '7 Aug 2026',
    endDate: '10 Aug 2026',
    trainer: 'R. Mehta',
    status: 'ongoing',
    progress: 80,
  },
  {
    id: 'wd-08',
    name: 'Full-Stack Web Development',
    batch: 'WD-08',
    duration: '16 weeks',
    batchSize: 25,
    startDate: '17 Aug 2026',
    endDate: '19 Aug 2026',
    trainer: 'Sunita Kale',
    status: 'ongoing',
    progress: 80,
  },
  {
    id: 'da-05',
    name: 'Data Analytics with Python',
    batch: 'DA-05',
    duration: '10 weeks',
    batchSize: 28,
    startDate: '5 Jun 2026',
    endDate: '7 Jun 2026',
    trainer: 'Ananya Patil',
    status: 'upcoming',
    progress: 65,
  },
  {
    id: 'dm-03',
    name: 'Digital Marketing Fundamentals',
    batch: 'DM-03',
    duration: '8 weeks',
    batchSize: 35,
    startDate: '1 Jun 2026',
    endDate: '4 Jun 2026',
    trainer: 'Karan Kale',
    status: 'completed',
    progress: 100,
  },
];

export const coursesPagination = {
  currentPage: 1,
  totalPages: 9,
  pageSize: 4,
  totalResults: 86,
};

// ── Short term Training tab ─────────────────────────────────────────

// Static - Type filter
export const trainingTypeOptions = [
  { value: 'all', label: 'All Type' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
];

// GET /api/admin/trainers (Trainer filter)
export const trainingTrainerOptions = [
  { value: 'all', label: 'ALL Trainers' },
  { value: 'r-mehta', label: 'R. Mehta' },
  { value: 'sunita-kale', label: 'Sunita Kale' },
  { value: 'ananya-patil', label: 'Ananya Patil' },
  { value: 'karan-kale', label: 'Karan Kale' },
];

// Static - Status filter
export const trainingStatusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

// GET /api/admin/short-term-trainings?search=&type=&trainer=&status=&date=&page=
export const shortTermTrainingList = [
  {
    id: 'cyber-security-awareness',
    name: 'Cyber security Awareness',
    type: 'Workshop',
    duration: '3 Days',
    startDate: '7 Aug 2026',
    endDate: '10 Aug 2026',
    trainer: 'R. Mehta',
    participants: { current: 45, total: 50 },
    status: 'upcoming',
  },
  {
    id: 'workplace-communication-skill',
    name: 'Workplace communication skill',
    type: 'Seminar',
    duration: '2 Days',
    startDate: '17 Aug 2026',
    endDate: '19 Aug 2026',
    trainer: 'Sunita Kale',
    participants: { current: 38, total: 50 },
    status: 'upcoming',
  },
  {
    id: 'nail-art',
    name: 'Nail art',
    type: 'workshop',
    duration: '2 Days',
    startDate: '5 Jun 2026',
    endDate: '7 Jun 2026',
    trainer: 'Ananya Patil',
    participants: { current: 40, total: 50 },
    status: 'completed',
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial intelligence',
    type: 'Seminar',
    duration: '3 Days',
    startDate: '1 Jun 2026',
    endDate: '4 Jun 2026',
    trainer: 'Karan Kale',
    participants: { current: 45, total: 50 },
    status: 'completed',
  },
];

export const shortTermPagination = {
  currentPage: 1,
  totalPages: 9,
  pageSize: 4,
  totalResults: 86,
};
