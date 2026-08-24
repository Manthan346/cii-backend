// Data for the Enquiries page.
// `stats` are aggregate KPIs (backend count query) — same as the admin
// Approval Requests page, these intentionally don't have to match how
// many rows happen to be in the local `candidates` sample below. In
// production, `candidates` would be one paginated page of the same
// 1,200-row dataset the stats are counted from.

export const enquiriesStats = [
  { id: 'total', icon: 'ClipboardList', value: 1200, label: 'Total Enquires' },
  { id: 'pending', icon: 'FileEdit', value: 100, label: 'Pending Enquires' },
  { id: 'not-connected', icon: 'UserX', value: 150, label: 'Not connected' },
  { id: 'centre-visited', icon: 'BadgeCheck', value: 450, label: 'Centre Visited' },
];

export const enquiryTabs = ['All', 'New Enquiries', 'Pending Verification', 'Verified', 'Dropped out'];

export const statusFilterOptions = [
  { value: 'all', label: 'Status' },
  { value: 'new', label: 'New Enquiries' },
  { value: 'pending', label: 'Pending Verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'dropped', label: 'Dropped out' },
];

export const enquirySourceOptions = [
  { value: 'all', label: 'Enquiry Source' },
  { value: 'training', label: 'Training' },
  { value: 'placement', label: 'Placement' },
];

// status: 'Visited Centre' | 'Verified' | 'Dropped Out' | 'Not Visited'
export const candidates = [
  {
    id: 'C-1001',
    firstName: 'Rekha',
    lastName: 'Patil',
    area: 'Kandivali west',
    enquirySource: 'Training',
    enquiryDate: '14 July',
    contact: '872478543',
    email: 'Rekhap34@gmail.com',
    education: '12th Pass',
    status: 'Visited Centre',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '14 July', time: '10:00 AM', by: 'Nisha pawar', location: 'Akurli road' },
      { event: 'Call Dropped out', dotTone: 'red', date: '14 July', time: '10:05 AM', by: 'Nisha pawar', location: 'Akurli road' },
      { event: 'Call received', dotTone: 'green', date: '14 July', time: '10:10 AM', by: 'Nisha pawar', location: 'Akurli road' },
      { event: 'Centre visited', dotTone: 'blue', date: '15 July', time: '11:00 AM', by: 'Nisha pawar', location: 'Akurli road' },
    ],
  },
  {
    id: 'C-1002',
    firstName: 'Rajesha',
    lastName: 'sharma',
    area: 'Akurli road',
    enquirySource: 'Placement',
    enquiryDate: '12 July',
    contact: '6734567832',
    email: 'rajesha.sharma@gmail.com',
    education: 'Graduate',
    status: 'Visited Centre',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '12 July', time: '9:30 AM', by: 'Nisha pawar', location: 'Akurli road' },
      { event: 'Centre visited', dotTone: 'blue', date: '13 July', time: '2:00 PM', by: 'Nisha pawar', location: 'Akurli road' },
    ],
  },
  {
    id: 'C-1003',
    firstName: 'Priya',
    lastName: 'Deshmukh',
    area: 'Kandivali, East',
    enquirySource: 'Training',
    enquiryDate: '4 July',
    contact: '5423459830',
    email: 'priya.deshmukh@gmail.com',
    education: 'Diploma',
    status: 'Verified',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '4 July', time: '11:00 AM', by: 'Nisha pawar', location: 'Kandivali East' },
      { event: 'Centre visited', dotTone: 'blue', date: '5 July', time: '3:00 PM', by: 'Nisha pawar', location: 'Kandivali East' },
      { event: 'Verified', dotTone: 'green', date: '6 July', time: '10:00 AM', by: 'Nisha pawar', location: 'Kandivali East' },
    ],
  },
  {
    id: 'C-1004',
    firstName: 'Ritu',
    lastName: 'Patil',
    area: 'Kandivali, west',
    enquirySource: 'Training',
    enquiryDate: '10 July',
    contact: '5423459837',
    email: 'ritu.patil@gmail.com',
    education: '10th Pass',
    status: 'Dropped Out',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '10 July', time: '9:00 AM', by: 'Nisha pawar', location: 'Kandivali West' },
      { event: 'Call Dropped out', dotTone: 'red', date: '10 July', time: '9:15 AM', by: 'Nisha pawar', location: 'Kandivali West' },
    ],
  },
  {
    id: 'C-1005',
    firstName: 'Kiran',
    lastName: 'pawar',
    area: 'Akurli Road',
    enquirySource: 'Placement',
    enquiryDate: '10 July',
    contact: '5423459837',
    email: 'kiran.pawar@gmail.com',
    education: 'Graduate',
    status: 'Not Visited',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '10 July', time: '4:00 PM', by: 'Nisha pawar', location: 'Akurli road' },
    ],
  },
  {
    id: 'C-1006',
    firstName: 'Anjali',
    lastName: 'Kadam',
    area: 'Malad West',
    enquirySource: 'Training',
    enquiryDate: '9 July',
    contact: '9876543210',
    email: 'anjali.kadam@gmail.com',
    education: '12th Pass',
    status: 'Verified',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '9 July', time: '10:00 AM', by: 'Nisha pawar', location: 'Malad West' },
      { event: 'Verified', dotTone: 'green', date: '9 July', time: '2:00 PM', by: 'Nisha pawar', location: 'Malad West' },
    ],
  },
  {
    id: 'C-1007',
    firstName: 'Ganesh',
    lastName: 'Pawar',
    area: 'Borivali East',
    enquirySource: 'Placement',
    enquiryDate: '8 July',
    contact: '9123456780',
    email: 'ganesh.pawar@gmail.com',
    education: 'Graduate',
    status: 'Visited Centre',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '8 July', time: '11:30 AM', by: 'Nisha pawar', location: 'Borivali East' },
      { event: 'Centre visited', dotTone: 'blue', date: '9 July', time: '1:00 PM', by: 'Nisha pawar', location: 'Borivali East' },
    ],
  },
  {
    id: 'C-1008',
    firstName: 'Sneha',
    lastName: 'More',
    area: 'Kandivali West',
    enquirySource: 'Training',
    enquiryDate: '7 July',
    contact: '9988776655',
    email: 'sneha.more@gmail.com',
    education: '12th Pass',
    status: 'Dropped Out',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '7 July', time: '9:45 AM', by: 'Nisha pawar', location: 'Kandivali West' },
      { event: 'Call Dropped out', dotTone: 'red', date: '7 July', time: '10:00 AM', by: 'Nisha pawar', location: 'Kandivali West' },
    ],
  },
  {
    id: 'C-1009',
    firstName: 'Rohit',
    lastName: 'Shinde',
    area: 'Goregaon',
    enquirySource: 'Placement',
    enquiryDate: '6 July',
    contact: '9871234560',
    email: 'rohit.shinde@gmail.com',
    education: 'Diploma',
    status: 'Not Visited',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '6 July', time: '3:15 PM', by: 'Nisha pawar', location: 'Goregaon' },
    ],
  },
  {
    id: 'C-1010',
    firstName: 'Pooja',
    lastName: 'Jadhav',
    area: 'Kandivali East',
    enquirySource: 'Training',
    enquiryDate: '5 July',
    contact: '9012345678',
    email: 'pooja.jadhav@gmail.com',
    education: '12th Pass',
    status: 'Verified',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '5 July', time: '10:20 AM', by: 'Nisha pawar', location: 'Kandivali East' },
      { event: 'Verified', dotTone: 'green', date: '5 July', time: '4:00 PM', by: 'Nisha pawar', location: 'Kandivali East' },
    ],
  },
  {
    id: 'C-1011',
    firstName: 'Vikas',
    lastName: 'Naik',
    area: 'Malad East',
    enquirySource: 'Placement',
    enquiryDate: '4 July',
    contact: '9345678901',
    email: 'vikas.naik@gmail.com',
    education: 'Graduate',
    status: 'Visited Centre',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '4 July', time: '9:00 AM', by: 'Nisha pawar', location: 'Malad East' },
      { event: 'Centre visited', dotTone: 'blue', date: '5 July', time: '12:00 PM', by: 'Nisha pawar', location: 'Malad East' },
    ],
  },
  {
    id: 'C-1012',
    firstName: 'Kavita',
    lastName: 'Yadav',
    area: 'Borivali West',
    enquirySource: 'Training',
    enquiryDate: '3 July',
    contact: '9456789012',
    email: 'kavita.yadav@gmail.com',
    education: '10th Pass',
    status: 'Not Visited',
    avatarTone: 'navy',
    timeline: [
      { event: 'Contact by mobilizer', dotTone: 'navy', date: '3 July', time: '2:30 PM', by: 'Nisha pawar', location: 'Borivali West' },
    ],
  },
];

// Options shown in the "Update Status" dropdown menu inside the
// candidate detail modal. `dotTone` is what a new timeline entry created
// from this option would use as its marker color.
export const statusUpdateOptions = [
  { label: 'Call Received', icon: 'Phone', dotTone: 'navy' },
  { label: 'Call Dropped Out', icon: 'PhoneOff', dotTone: 'red' },
  { label: 'Centre Visited', icon: 'UserCheck', dotTone: 'blue' },
  { label: 'Centre Not Visited', icon: 'UserX', dotTone: 'gray' },
  { label: 'Enrolled', icon: 'FileCheck2', dotTone: 'green' },
  { label: 'Wrong Number', icon: 'XCircle', dotTone: 'red' },
  { label: 'Busy', icon: 'PhoneMissed', dotTone: 'orange' },
];
