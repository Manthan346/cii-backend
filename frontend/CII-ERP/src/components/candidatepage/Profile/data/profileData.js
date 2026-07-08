// profileData.js
// Static sample data for the Profile page.
// TODO: replace with API responses, e.g. fetch('/api/candidate/profile')

export const CANDIDATE = {
  name: 'Aisha',
  fullName: 'Aisha Sheikh',
  candidateId: 'CD-10482',
  batch: 'DS-24',
  status: 'Active',
  avatarSrc: null,
  completionPct: 75,
};

export const BASIC_INFO = {
  fullName: 'Aisha Sheikh',
  guardianName: 'Imran Sheikh',
  phoneno: '+91 9856124624',
  email: 'aisha.sheikh@gmail.com',
  gender: 'Female',
  dob: '14 March 2001',
  category: 'General',
  bloodGroup: 'O+',
  Qualification: '10th SSC (84.4%)'
};

export const COMPLETION_CHECKLIST = [
  { label: 'Basic Information added', done: true },
  { label: 'Contact Details verified', done: true },
  { label: 'Academic Records added',   done: true },
  { label: 'Upload Government ID Proof', done: false },
  { label: 'Resume Added', done: false },
];

export const ADDRESS_DETAIL ={
  mainaddress: 'E/205, Shree sai, Om nagar, Kandivali (w)',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  pincode: '400101',
}

export const APPLIED_COURSES = [
  {
    id: 'course-001',
    title: 'Cyber Security',
    courseName: 'Cyber security',
    company: 'Cyber security',
    mode: 'Online',
    location: 'ABVKVK',
    enrolledDate: '20 jun 2026',
    startingDate: '24 jun 2026',
    endDate: '24 aug 2026',
    trainerName: 'R.Mehta',
    supervisorName: 'R.Mehta',
  },
  {
    id: 'course-002',
    title: 'Data Analyst',
    courseName: 'Data Analyst',
    company: '(Company name)',
    mode: 'Online',
    location: 'ABVKVK',
    enrolledDate: '20 jun 2026',
    startingDate: '24 jun 2026',
    endDate: '24 aug 2026',
    trainerName: 'R.Mehta',
    supervisorName: 'R.Mehta',
  },
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-passport-photo',
    name: 'Passport size Photo',
    uploadedOn: null,
    status: 'pending',
    kind: 'single',
  },
  {
    id: 'doc-pan-card',
    name: 'PAN Card',
    uploadedOn: '12 jan 2025',
    status: 'verified',
    kind: 'single',
  },
  {
    id: 'doc-aadhar-card',
    name: 'Aadhar Card',
    uploadedOn: '12 jan 2025',
    status: 'verified',
    kind: 'single',
  },
  {
    id: 'doc-resume',
    name: 'Resume',
    uploadedOn: '12 jan 2025',
    status: 'verified',
    kind: 'single',
  },
  {
    id: 'doc-portfolio',
    name: 'Portfolio',
    uploadedOn: '12 jan 2025',
    status: 'verified',
    kind: 'single',
  },
];

export const INITIAL_SKILLS = ['python', 'SQL', 'excel', 'Communications', 'Data visualization'];
