// Profile.jsx
// Root page — "My Profile" section. Composes the sidebar, topbar, identity
// header, tab navigation, and the four tab panels (personal info, academic
// detail, document, skills & links).
//
// ─── Backend hookup ─────────────────────────────────────────────────────
//   useEffect(() => {
//     fetch('/api/candidate/profile').then(r => r.json()).then(setCandidate);
//     fetch('/api/candidate/documents').then(r => r.json()).then(setDocuments);
//     fetch('/api/candidate/skills').then(r => r.json()).then(setSkills);
//   }, []);
// ──────────────────────────────────────────────────────────────────────

import { useState } from 'react';

// Reusable layout components (already live in the project — not duplicated here)
import Sidebar from '../../layout/Sidebar/Sidebar';
import Topbar  from '../../layout/Topbar/Topbar';

import ProfileHeader  from '../ProfileHeader/ProfileHeader';
import ProfileTabs    from '../ProfileTabs/ProfileTabs';
import PersonalInfo   from '../PersonalInfo/PersonalInfo';
import AcademicDetail from '../AcademicDetail/AcademicDetail';
import Document       from '../Document/Document';
import Skills         from '../Skills/Skills';

import './Profile.css';
import orgLogo from '../../../../assets/Logo.png';
import {
  CANDIDATE,
  BASIC_INFO,
  COMPLETION_CHECKLIST,
  ADDRESS_DETAIL,
  APPLIED_COURSES,
  INITIAL_DOCUMENTS,
  INITIAL_SKILLS,
} from '../../../../data/profileData';

export default function Profile() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const orgLogoSrc = orgLogo;

  return (
    <div className="profile-page">

      {/* Fixed left sidebar */}
      <Sidebar orgLogoSrc={orgLogoSrc} activeItem="My Profile" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right: topbar + page body */}
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
              info={{ ...BASIC_INFO, ...ADDRESS_DETAIL }}
              checklist={COMPLETION_CHECKLIST}
              completionPct={CANDIDATE.completionPct}
            />
          )}

          {activeTab === 'academic' && (
            <AcademicDetail
              appliedCourses={APPLIED_COURSES}
            />
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
