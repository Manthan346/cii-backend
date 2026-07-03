// profileData.js
// Static sample data for the Profile page.
// TODO: replace with API responses, e.g. fetch('/api/candidate/profile')

export const CANDIDATE = {
  name: 'Anisha',
  fullName: 'Aisha Sheikh',
  candidateId: 'CD-10482',
  batch: 'DS-24',
  status: 'Active',
  avatarSrc: null,
  completionPct: 75,
};

export const BASIC_INFO = {
  fullName: 'Aisha Sheikh',
  dob: '14 March 2001',
  gender: 'Female',
  bloodGroup: 'O+',
  guardianName: 'Imran Sheikh',
  category: 'General',
};

export const COMPLETION_CHECKLIST = [
  { label: 'Basic Information added', done: true },
  { label: 'Contact Details verified', done: true },
  { label: 'Academic Records added',   done: true },
  { label: 'Upload Government ID Proof', done: false },
];

export const ACADEMIC_DETAIL = {
  program: 'Cyber Security',
  batch: 'DS-24',
  enrollmentDate: '3 February 2025',
  expectedCompletion: '28 August 2026',
  mentor: 'R. Mehta',
  mode: 'Hybrid (online + campus)',
};

export const SNAPSHOT = [
  { icon: 'document',     label: 'Enrolled Courses'   },
  { icon: 'certificates', label: 'Certificates earned' },
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-10th-12th',
    name: '10th & 12th Marksheet.pdf',
    uploadedOn: '12 Jan 2025',
    status: 'verified',
    kind: 'single',
  },
  {
    id: 'doc-degree',
    name: 'Graduation Degree.pdf',
    uploadedOn: '12 Jan 2025',
    status: 'verified',
    kind: 'single',
  },
  {
    id: 'doc-govt-id',
    name: 'Government ID Proof',
    uploadedOn: '12 Jan 2025',
    status: 'pending',
    kind: 'govtId',
    subDocs: [
      { key: 'pan',    label: 'PAN Card',    file: null },
      { key: 'aadhar', label: 'Aadhaar Card', file: null },
    ],
  },
];

export const INITIAL_SKILLS = ['python', 'SQL', 'excel', 'Communications', 'Data visualization'];
