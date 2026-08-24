import React, { useState } from 'react';
import Tabs from '../../shared/Tabs/Tabs';
import ProfileHeaderCard from '../ProfileHeaderCard/ProfileHeaderCard';
import BasicInformationPanel from '../BasicInformationPanel/BasicInformationPanel';
import AcademicDetailPanel from '../AcademicDetailPanel/AcademicDetailPanel';
import DocumentPanel from '../DocumentPanel/DocumentPanel';
import GuardianDetailsPanel from '../GuardianDetailsPanel/GuardianDetailsPanel';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import { profileData } from '../../data';
import './Profile.css';

const TABS = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'academic', label: 'Academic Detail' },
  { id: 'document', label: 'Document' },
  { id: 'guardian', label: 'Guardian Details' },
];

/**
 * Profile (Admin)
 *
 * The logged-in admin's own profile: a blue header card, four section
 * tabs (Basic Information / Academic Detail / Document / Guardian
 * Details), and an Edit Profile modal reachable from the header.
 *
 * `profile` is held in local state, seeded from data/profileData.js -
 * swap for a real `GET /api/admin/me/profile` fetch once the backend
 * is ready. EditProfileModal's onSave currently just merges the
 * edited fields back into this local state; wire it to
 * `PATCH /api/admin/me/profile` (see the TODO in EditProfileModal.jsx)
 * once that endpoint exists.
 */
const Profile = () => {
  const [profile, setProfile] = useState(profileData);
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSaveProfile = (form) => {
    setProfile((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...form.personal },
      contact: { ...prev.contact, ...form.contact },
      currentAddress: { ...prev.currentAddress, ...form.currentAddress },
      permanentAddress: { ...prev.permanentAddress, ...form.permanentAddress },
      guardians: { ...prev.guardians, ...form.guardians },
      education: { ...prev.education, ...form.education },
      experience: { ...prev.experience, ...form.experience },
      header: { ...prev.header, name: form.personal.name },
    }));
  };

  return (
    <div className="admin-profile-page">
      <ProfileHeaderCard header={profile.header} onEditProfile={() => setIsEditOpen(true)} />

      <Tabs variant="pills" tabs={TABS} activeId={activeTab} onChange={setActiveTab} />

      {activeTab === 'basic' && (
        <BasicInformationPanel
          personal={profile.personal}
          contact={profile.contact}
          completionChecklist={profile.completionChecklist}
          profileCompletion={profile.header.profileCompletion}
          currentAddress={profile.currentAddress}
          permanentAddress={profile.permanentAddress}
        />
      )}

      {activeTab === 'academic' && (
        <AcademicDetailPanel education={profile.education} experience={profile.experience} />
      )}

      {activeTab === 'document' && (
        <DocumentPanel
          documents={profile.documents}
          onReupload={(id) => console.log('re-upload', id)}
          onView={(id) => console.log('view document', id)}
          onUploadNew={() => console.log('upload new document')}
        />
      )}

      {activeTab === 'guardian' && <GuardianDetailsPanel guardians={profile.guardians} />}

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
