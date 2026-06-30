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

import Sidebar       from '../Sidebar/Sidebar';
import Topbar         from '../Topbar/Topbar';
import ProfileHeader  from '../ProfileHeader/ProfileHeader';
import ProfileTabs    from '../ProfileTabs/ProfileTabs';
import PersonalInfo   from '../PersonalInfo/PersonalInfo';
import AcademicDetail from '../AcademicDetail/AcademicDetail';
import Document       from '../Document/Document';
import Skills         from '../Skills/Skills';

import './Profile.css';
import orgLogo from '../../../Assets/Logo.png';
import {
  CANDIDATE,
  BASIC_INFO,
  COMPLETION_CHECKLIST,
  ACADEMIC_DETAIL,
  SNAPSHOT,
  INITIAL_DOCUMENTS,
  INITIAL_SKILLS,
} from '../data/profileData';

export default function Profile() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [skills, setSkills] = useState(INITIAL_SKILLS);

  const orgLogoSrc = orgLogo;

  return (
    <div className="profile-page">

      {/* Fixed left sidebar */}
      <Sidebar orgLogoSrc={orgLogoSrc} activeItem="My Profile" />

      {/* Right: topbar + page body */}
      <div className="profile-page__main">

        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials="AS"
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
