import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import ProfileTabs from '../ProfileTabs/ProfileTabs';
import BasicInformationTab from '../BasicInformationTab/BasicInformationTab';
import AcademicDetailTab from '../AcademicDetailTab/AcademicDetailTab';
import DocumentTab from '../DocumentTab/DocumentTab';
import ContactDetailsTab from '../GuardianDetailsTab/GuardianDetailsTab';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import {
  staffProfile,
  profileTabs,
  profileBasicInfo,
  profileCompletion,
  profileEducation,
  profileExperience,
  profileDocuments,
  profileDocumentNote,
  profileGuardianDetail,
} from '../../../data';
import '../../../styles/variables.css';
import './Profile.css';

/**
 * Profile (full page, "My Profile")
 *
 * Staff profile page. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page) around the teal
 * hero card, the 4-way tab strip, and whichever tab panel is active.
 * All fake data comes from data/profileData.js so it can be swapped
 * for API responses later without touching this file.
 *
 * Personal/Contact/Address/Guardian/Education/Experience are lifted
 * into state here (instead of read directly off the imported data) so
 * the "Edit Profile" popup can save changes and have them show up
 * immediately across whichever tab is open.
 *
 * Basic Information now also carries Contact + Address (moved out of
 * the old Contact Details tab), and Contact Details now shows Guardian
 * Information (moved out of Basic Information) - see EditProfileModal
 * and the data/profileData.js comments for the full picture.
 *
 * Address is now two separate objects - currentAddress and
 * permanentAddress - each rendered from its own prop with no
 * fallback between the two (see BasicInformationTab.jsx). Both tabs
 * that show address (Basic Information and Guardian Details) receive
 * the same two state values from here.
 *
 * This is also where the Topbar's avatar button lands: Topbar.jsx
 * navigates to this page's route by default when no onAvatarClick
 * override is passed in, the same way its bell icon defaults to the
 * Notifications route.
 */
const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState(profileTabs[0].id);
  const [showEditModal, setShowEditModal] = useState(false);

  const [personal, setPersonal] = useState(profileBasicInfo.personal);
  const [contact, setContact] = useState(profileBasicInfo.contact);
  const [currentAddress, setCurrentAddress] = useState(
    profileBasicInfo.currentAddress
  );
  const [permanentAddress, setPermanentAddress] = useState(
    profileBasicInfo.permanentAddress
  );
  const [guardian, setGuardian] = useState(profileGuardianDetail.guardian);
  const [education, setEducation] = useState(profileEducation);
  const [experience, setExperience] = useState(profileExperience);

  const handleSaveProfile = (updated) => {
    setPersonal(updated.personal);
    setContact(updated.contact);
    setCurrentAddress(updated.currentAddress);
    setPermanentAddress(updated.permanentAddress);
    setGuardian(updated.guardian);
    setEducation(updated.education);
    setExperience(updated.experience);
    setShowEditModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-information':
        return (
          <BasicInformationTab
            personal={personal}
            contact={contact}
            currentAddress={currentAddress}
            permanentAddress={permanentAddress}
            completion={profileCompletion}
          />
        );
      case 'academic-detail':
        return (
          <AcademicDetailTab education={education} experience={experience} />
        );
      case 'document':
        return (
          <DocumentTab
            documents={profileDocuments}
            note={profileDocumentNote}
          />
        );
      case 'guardian-details':
        return (
          <ContactDetailsTab
            guardian={guardian}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: 'Staff Admin' }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        onSearch={setSearchValue}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="profile-page">
              <div className="profile-page__hero">
                <img
                  src={staffProfile.avatar}
                  alt={staffProfile.name}
                  className="profile-page__photo"
                />

                <div className="profile-page__hero-card">
                  <button
                    type="button"
                    className="profile-page__edit-btn"
                    onClick={() => setShowEditModal(true)}
                  >
                    <Pencil size={13} />
                    Edit Profile
                  </button>

                  <p className="profile-page__completed">
                    {staffProfile.profileCompletedPercent} % Profile Completed
                  </p>

                  <h1 className="profile-page__name">
                    {personal.name}{' '}
                    <span className="profile-page__role">
                      ({staffProfile.role})
                    </span>
                  </h1>
                  <p className="profile-page__id">
                    ID : {staffProfile.employeeId}
                  </p>

                  <span className="profile-page__status">
                    {staffProfile.status}
                  </span>
                </div>
              </div>

              <ProfileTabs
                tabs={profileTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />

              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          personal={personal}
          contact={contact}
          currentAddress={currentAddress}
          permanentAddress={permanentAddress}
          guardian={guardian}
          education={education}
          experience={experience}
          onCancel={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default Profile;