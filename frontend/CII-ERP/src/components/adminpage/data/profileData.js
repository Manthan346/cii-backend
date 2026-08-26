import mansi from '../assets/mansi.png';

/**
 * data/profileData.js
 *
 * Mock data for the admin Profile page and its section components
 * (ProfileHeaderCard, BasicInformationPanel, AcademicDetailPanel,
 * DocumentPanel, GuardianDetailsPanel, EditProfileModal).
 *
 * This is the logged-in admin's own profile, not a directory entry -
 * so in a real integration this whole file becomes one
 * `GET /api/admin/me/profile` call (and the edit modal writes back via
 * `PATCH /api/admin/me/profile`), rather than several separate
 * endpoints like the other admin pages. Kept as one object below for
 * that reason.
 */
export const profileData = {
  header: {
    name: 'マナシ・チャヴァン',
    role: 'Centre Admin',
    employeeId: 'CSAJ-2205',
    status: 'Active',
    profileCompletion: 75,
    avatarUrl: mansi,
  },
  personal: {
    name: 'マナシ・チャヴァン',
    gender: 'FEMALE',
    dob: '12 Mar 2002',
    bloodGroup: 'B+',
    designation: 'Centre Admin',
    companyName: 'CII',
    highestQualification: 'MBA in HR',
  },
  contact: {
    mobile: '9876543210',
    emergencyContact: '9123456780',
    email: 'mansichavan.cii_mcc@.in',
  },
  completionChecklist: [
    { id: 'basic', label: 'Basic Information added', status: 'done' },
    { id: 'contact', label: 'Contact Details added', status: 'done' },
    { id: 'address', label: 'Address Details pending', status: 'warning' },
    { id: 'document', label: 'Documents pending', status: 'warning' },
  ],
  currentAddress: {
    line: 'CII Office Complex, Andheri East',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Mumbai',
    pinCode: '400069',
  },
  permanentAddress: {
    line: '904 Futaba-cho, Kasukabe City, Saitama Prefecture, Japan',
    state: 'Tokyo',
    district: ' Kasukabe',
    city: ' Kasukabe',
    pinCode: '411005',
  },
  education: {
    highestEducation: 'MBA in HR',
    specialization: 'Human Resources',
    university: 'Futaba Kindergarten',
    passingYear: '2012',
    additionalQualification: '',
    certifications: '',
  },
  experience: {
    totalExperience: '10',
    previousOrganization: 'TCS',
    role: 'HR Manager',
  },
  documents: [
    { id: 'qualification', title: 'Highest Qualification Document', required: false, date: '8/11/2026' },
    { id: 'experience-letter', title: 'Past Experience letter', required: false, date: '8/11/2026' },
    { id: 'pan', title: 'PAN Card', required: true, date: '8/11/2026' },
    { id: 'aadhar', title: 'Aadhar Card', required: true, date: '8/11/2026' },
    { id: 'resume', title: 'Resume', required: true, date: '8/11/2026' },
  ],
  guardians: {
    father: {
      name: 'Suresh Raut',
      relationship: 'Father',
      mobile: '9822334455',
      occupation: 'Business',
      bloodGroup: 'B+',
      address: 'Shivaji Nagar, Near Market Yard, Pune',
    },
    mother: {
      name: 'Sunita Raut',
      relationship: 'Mother',
      mobile: '9822556677',
      occupation: 'Homemaker',
      bloodGroup: 'O+',
      address: 'Shivaji Nagar, Near Market Yard, Pune',
    },
    guardian: {
      name: '',
      relationship: '',
      mobile: '',
      occupation: '',
      bloodGroup: '',
      address: '',
    },
  },
};
