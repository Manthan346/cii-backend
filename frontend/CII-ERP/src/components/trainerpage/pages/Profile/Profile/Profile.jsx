import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import ProfileTabs from '../ProfileTabs/ProfileTabs';
import BasicInformationTab from '../BasicInformationTab/BasicInformationTab';
import AcademicDetailTab from '../AcademicDetailTab/AcademicDetailTab';
import DocumentTab from '../DocumentTab/DocumentTab';
import ContactDetailsTab from '../GuardianDetailsTab/GuardianDetailsTab';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import { fetchAcademicDetails } from '../../../../../../api/trainer/academicService';
import { fetchInstructorProfile } from '../../../../../../api/trainer/profileService';
import { getCompletionLabel, getCompletionChecklist } from '../../../data/getCompletionMeta';
import {
  staffProfile,
  profileTabs,
  profileDocuments,
  profileDocumentNote,
  profileGuardianDetail,
} from '../../../data';
import '../../../styles/variables.css';
import './Profile.css';

/**
 * Profile (full page, "My Profile")
 *
 * Basic Information (personal + contact + both addresses + completion)
 * is now fetched from GET /instructor-profile on mount, replacing the
 * profileBasicInfo / profileCompletion mocks. See
 * api/trainer/profileService.js and data/getCompletionMeta.js.
 *
 * The backend returns one `profileCompletion` number, not two - so the
 * hero card's "% Profile Completed" and the ProfileCompletionCard ring
 * now both read from the same completionPercent state, instead of the
 * old mock's two different values (staffProfile.profileCompletedPercent
 * vs profileCompletion.percent).
 *
 * The checklist under the completion ring is derived live from which
 * basicInformation fields are actually filled (see getCompletionMeta.js)
 * rather than hardcoded booleans - it only covers the 2 items this
 * endpoint can know about (Basic Information, Contact). "Upload ID
 * Proof" / "Resume Added" were dropped until Documents is wired the
 * same way.
 *
 * Academic Detail (education + experience) is still fetched separately
 * from GET /academics-details - see the previous header notes, which
 * still apply to that part of this file.
 */
const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState(profileTabs[0].id);
  const [showEditModal, setShowEditModal] = useState(false);

  const [personal, setPersonal] = useState(null);
  const [contact, setContact] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [permanentAddress, setPermanentAddress] = useState(null);
  const [completionPercent, setCompletionPercent] = useState(0);
  const [completionChecklist, setCompletionChecklist] = useState([]);
  const [basicInfoLoading, setBasicInfoLoading] = useState(true);
  const [basicInfoError, setBasicInfoError] = useState(null);

  const [guardians, setGuardians] = useState(profileGuardianDetail.guardians);
  const [activeGuardianIndex, setActiveGuardianIndex] = useState(0);

  const [education, setEducation] = useState(null);
  const [experience, setExperience] = useState(null);
  const [academicLoading, setAcademicLoading] = useState(true);
  const [academicError, setAcademicError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBasicInfo() {
      setBasicInfoLoading(true);
      setBasicInfoError(null);
      try {
        const { profileCompletion, basicInformation } = await fetchInstructorProfile();
        if (!cancelled) {
          const personalInfo = basicInformation?.response?.basicInformation?.personalInformation
            ?? basicInformation?.basicInformation?.personalInformation
            ?? basicInformation?.personalInformation
            ?? null;
          const contactDetails = basicInformation?.response?.contactDetails
            ?? basicInformation?.contactDetails
            ?? null;
          const currentAddressData = basicInformation?.response?.currentAddress
            ?? basicInformation?.currentAddress
            ?? null;
          const permanentAddressData = basicInformation?.response?.permanentAddress
            ?? basicInformation?.permanentAddress
            ?? null;

          setPersonal(personalInfo);
          setContact(contactDetails);
          setCurrentAddress(currentAddressData);
          setPermanentAddress(permanentAddressData);
          setCompletionPercent(profileCompletion ?? 0);
          setCompletionChecklist(getCompletionChecklist(basicInformation));
        }
      } catch (err) {
        if (!cancelled) setBasicInfoError(err.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setBasicInfoLoading(false);
      }
    }

    loadBasicInfo();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAcademicDetails() {
      setAcademicLoading(true);
      setAcademicError(null);
      try {
        const details = await fetchAcademicDetails();
        if (!cancelled) {
          setEducation(details.education);
          setExperience(details.experience);
        }
      } catch (err) {
        if (!cancelled) setAcademicError(err.message || 'Failed to load academic details');
      } finally {
        if (!cancelled) setAcademicLoading(false);
      }
    }

    loadAcademicDetails();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = (updated) => {
    setPersonal(updated.personal);
    setContact(updated.contact);
    setCurrentAddress(updated.currentAddress);
    setPermanentAddress(updated.permanentAddress);
    setGuardians(updated.guardians);
    setEducation(updated.education);
    setExperience(updated.experience);
    setShowEditModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-information':
        if (basicInfoLoading) return <p>Loading profile…</p>;
        if (basicInfoError) return <p>Error: {basicInfoError}</p>;
        return (
          <BasicInformationTab
            personal={personal}
            contact={contact}
            currentAddress={currentAddress}
            permanentAddress={permanentAddress}
            completion={{
              percent: completionPercent,
              label: getCompletionLabel(completionPercent),
              checklist: completionChecklist,
            }}
          />
        );
      case 'academic-detail':
        if (academicLoading) return <p>Loading academic details…</p>;
        if (academicError) return <p>Error: {academicError}</p>;
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
            guardians={guardians}
            activeIndex={activeGuardianIndex}
            onIndexChange={setActiveGuardianIndex}
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
                    {basicInfoLoading ? '—' : completionPercent} % Profile Completed
                  </p>

                  <h1 className="profile-page__name">
                    {personal?.name ?? staffProfile.name}{' '}
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
          guardians={guardians}
          activeGuardianIndex={activeGuardianIndex}
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
