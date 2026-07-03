// Profile.jsx
// Root Profile page. Sits at:
//   src/components/candidatepage/Profile/Profile/Profile.jsx
// and is imported by CandidateDashboard.jsx as the "/my-profile" route.

import { useState } from 'react';

import Sidebar       from '../../layout/Sidebar/Sidebar';
import Topbar         from '../../layout/Topbar/Topbar';
import ProfileHeader  from '../ProfileHeader/ProfileHeader';
import ProfileTabs    from '../ProfileTabs/ProfileTabs';
import PersonalInfo   from '../PersonalInfo/PersonalInfo';
import AcademicDetail from '../AcademicDetail/AcademicDetail';
import Document       from '../Document/Document';
import Skills         from '../Skills/Skills';

import './Profile.css';
import orgLogo from '../../../../assets/Logo.png';

// ── Static profile data ─────────────────────────────────────
// TODO: replace with /api/candidate/profile response

const CANDIDATE = {
  name: 'Anisha',
  fullName: 'Aisha Sheikh',
  candidateId: 'CD-10482',
  batch: 'DS-24',
  status: 'Active',
  avatarSrc: null,
  completionPct: 75,
};

const BASIC_INFO = {
  fullName: 'Aisha Sheikh',
  dob: '14 March 2001',
  gender: 'Female',
  bloodGroup: 'O+',
  guardianName: 'Imran Sheikh',
  category: 'General',
};

const COMPLETION_CHECKLIST = [
  { label: 'Basic Information added',    done: true  },
  { label: 'Contact Details verified',   done: true  },
  { label: 'Academic Records added',     done: true  },
  { label: 'Upload Government ID Proof', done: false },
];

const ACADEMIC_DETAIL = {
  program: 'Cyber Security',
  batch: 'DS-24',
  enrollmentDate: '3 February 2025',
  expectedCompletion: '28 August 2026',
  mentor: 'R. Mehta',
  mode: 'Hybrid (online + campus)',
};

const SNAPSHOT = [
  { icon: 'document',     label: 'Enrolled Courses'    },
  { icon: 'certificates', label: 'Certificates earned' },
];

const INITIAL_DOCUMENTS = [
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
      { key: 'pan',    label: 'PAN Card',     file: null },
      { key: 'aadhar', label: 'Aadhaar Card', file: null },
    ],
  },
];

const INITIAL_SKILLS = ['python', 'SQL', 'excel', 'Communications', 'Data visualization'];

// ────────────────────────────────────────────────────────────

export default function Profile() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="profile-page">

      <Sidebar
        orgLogoSrc={orgLogo}
        activeItem="My Profile"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="profile-page__main">

        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials="AS"
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <main className="profile-page__body">

          <ProfileHeader candidate={CANDIDATE} />

          <ProfileTabs active={activeTab} onChange={setActiveTab} />

          {activeTab === 'personal' && (
            <PersonalInfo
              info={BASIC_INFO}
              checklist={COMPLETION_CHECKLIST}
              completionPct={CANDIDATE.completionPct}
            />
          )}

          {activeTab === 'academic' && (
            <AcademicDetail academic={ACADEMIC_DETAIL} snapshot={SNAPSHOT} />
          )}

          {activeTab === 'document' && (
            <Document documents={documents} onDocumentsChange={setDocuments} />
          )}

          {activeTab === 'skills' && (
            <Skills skills={skills} onSkillsChange={setSkills} />
          )}

        </main>
      </div>
    </div>
  );
}
