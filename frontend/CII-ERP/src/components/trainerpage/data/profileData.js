// Dummy data for the My Profile page.
// Replace with API responses later, e.g.
//   GET /api/staff/me                 -> staffProfile
//   GET /api/staff/me/basic-info      -> profileBasicInfo, profileCompletion
//   GET /api/staff/me/academic-detail -> profileAcademicDetail
//   GET /api/staff/me/documents       -> profileDocuments
//   GET /api/staff/me/contact-detail  -> profileGuardianDetail

// NOTE on the name mismatch below: the reference design's teal hero
// banner reads "Anjali Mehta" on 3 of the 4 tab screenshots, while the
// Basic Information tab's own header + "Personal Information > Name"
// field read "Anjali Sharma" (email is also "anjalisharma22@gmail.com").
// This is reproduced exactly as designed rather than "corrected" -
// same convention as other quirks preserved elsewhere in this data
// folder (e.g. "15 july 20264" in tasksAssignedData.js).

import staffAvatar from '../assets/staff-avatar.jpg';

// ---- Hero card (name shown in the teal banner across all tabs) ----
export const staffProfile = {
  name: 'Anjali Sharma',
  role: 'Cyber Security Trainer',
  employeeId: 'CSaj-2205',
  status: 'Active',
  profileCompletedPercent: 75,
  avatar: staffAvatar,
};

// ---- Tab strip: Basic Information / Academic Detail / Document / Contact Details ----
export const profileTabs = [
  { id: 'basic-information', label: 'Basic Information' },
  { id: 'academic-detail', label: 'Academic Detail' },
  { id: 'document', label: 'Document' },
  { id: 'guardian-details', label: 'Guardian Details' },
];

// ---- Basic Information tab ----
// NOTE: Contact + Address (previously the separate "Contact Details" tab)
// now live here so all of a staff member's core info sits in one place.
// Guardian info moved the other way - see profileGuardianDetail below,
// which now surfaces inside the "Guardian Details" tab.
//
// currentAddress and permanentAddress are kept as two separate objects
// (rather than one `address` + a "same as current" flag) since the
// Basic Information tab now renders both side by side as their own
// section, each sourced strictly from its own prop with no fallback.
// This is the STAFF MEMBER's own address - not the guardian's (see
// profileGuardianDetail.guardian.currentAddress/permanentAddress below
// for the guardian's own address, which is a separate pair of fields).
export const profileBasicInfo = {
  personal: {
    name: 'Anjali Sharma',
    gender: 'Female',
    dob: '22 feb 1995',
    bloodGroup: 'AB-',
    highestQualification: 'Ph.D in Cyber Security',
  },
  contact: {
    mobileNumber: '+91 6475276534',
    emergencyContactNumber: '+91 3423567543',
    emailId: 'anjalisharma22@gmail.com',
  },
  currentAddress: {
    line: "'E' 205, Shree Sai Housing Society, Om Nagar, Kandivali (w)",
    state: 'Maharashtra',
    district: 'Mumbai suburban District',
    taluka: 'Kandivali',
    pinCode: '400067',
  },
  permanentAddress: {
    line: "'E' 205, Shree Sai Housing Society, Om Nagar, Kandivali (w)",
    state: 'Maharashtra',
    district: 'Mumbai suburban District',
    taluka: 'Kandivali',
    pinCode: '400067',
  },
};

export const profileCompletion = {
  percent: 85,
  label: 'Almost There!!',
  checklist: [
    { id: 'basic-info', label: 'Basic Information added', done: true },
    { id: 'contact-verified', label: 'Contact Details verified', done: true },
    { id: 'id-proof', label: 'Upload ID Proof', done: false },
    { id: 'resume', label: 'Resume Added', done: true },
  ],
};

// ---- Academic Detail tab (Education + Experience are two separate
// containers in the UI, so they're kept as two separate objects here) ----
export const profileEducation = {
  highestEducation: 'Ph.D in Cyber Security',
  specialization: 'Cyber Security',
  university: 'Indian Institute of Technology (IIT), Bombay',
  passingYear: '2022',
  additionalQualification: 'M Tech in Computer Engineering',
  certifications: 'Certified Ethical Hacker(CEH)',
};

export const profileExperience = {
  totalExperience: '3 Years Experience',
  previousOrganization: 'Cybersecurity Solutions Pvt. Ltd.',
  role: 'Senior Cyber Security Analyst',
};

// ---- Document tab ----
export const profileDocuments = [
  {
    id: 'doc-1',
    name: 'Highest Qualification Document',
    required: false,
    uploaded: true,
    uploadedOn: 'Uploaded 12 jan 2025',
    status: 'verified',
  },
  {
    id: 'doc-2',
    name: 'Past Experience letter',
    required: false,
    uploaded: false,
    uploadedOn: 'Not uploaded',
    status: null,
  },
  {
    id: 'doc-3',
    name: 'PAN Card',
    required: true,
    uploaded: true,
    uploadedOn: 'Uploaded 12 jan 2025',
    status: 'verified',
  },
  {
    id: 'doc-4',
    name: 'Aadhar Card',
    required: true,
    uploaded: true,
    uploadedOn: 'Uploaded 12 jan 2025',
    status: 'verified',
  },
  {
    id: 'doc-5',
    name: 'Resume',
    required: true,
    uploaded: true,
    uploadedOn: 'Uploaded 12 jan 2025',
    status: 'verified',
  },
];

export const profileDocumentNote =
  'File Size Should be less than 200KB (PDF Format only)';

// ---- Guardian Details tab ----
// Guardian's own address is split into currentAddress/permanentAddress
// (same shape as profileBasicInfo above: line/state/district/taluka/
// pinCode), replacing the old single flat `address` string. This is
// the GUARDIAN's address - separate from the staff member's own
// currentAddress/permanentAddress in profileBasicInfo above.
export const profileGuardianDetail = {
  guardians:
  [
    {
      name: 'Ram Sharma',
      relationship: 'Father',
      mobileNumber: '8723456284',
      occupation: 'Retired Govt. officer',
      bloodGroup: 'B+',
      currentAddress: {
        line: 'Shree Complex, Thane (w)',
        state: 'Maharashtra',
        district: 'Thane District',
        taluka: 'Thane',
        pinCode: '400101',
      },
      permanentAddress: {
        line: 'Shree Complex, Thane (w)',
        state: 'Maharashtra',
        district: 'Thane District',
        taluka: 'Thane',
        pinCode: '400101',
      },
    },
    {
      name: 'Sunita Sharma',
      relationship: 'Mother',
      mobileNumber: '9876543210',
      occupation: 'Homemaker',
      bloodGroup: 'O+',
      currentAddress: {
        line: 'Shree Complex, Thane (w)',
        state: 'Maharashtra',
        district: 'Thane District',
        taluka: 'Thane',
        pinCode: '400101',
      },
      permanentAddress: {
        line: 'Shree Complex, Thane (w)',
        state: 'Maharashtra',
        district: 'Thane District',
        taluka: 'Thane',
        pinCode: '400101',
      },
    },
    {
      name: 'Ramesh Sharma',
      relationship: 'Brother',
      mobileNumber: '9123456789',
      occupation: 'Software Engineer',
    }
  ]
};
