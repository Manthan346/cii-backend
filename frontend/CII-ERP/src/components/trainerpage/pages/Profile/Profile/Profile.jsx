import React, { useState } from "react";
import { Pencil } from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import ProfileTabs from "../ProfileTabs/ProfileTabs";
import BasicInformationTab from "../BasicInformationTab/BasicInformationTab";
import AcademicDetailTab from "../AcademicDetailTab/AcademicDetailTab";
import DocumentTab from "../DocumentTab/DocumentTab";
import ContactDetailsTab from "../ContactDetailsTab/ContactDetailsTab";
import {
  staffProfile,
  profileTabs,
  profileBasicInfo,
  profileCompletion,
  profileEducation,
  profileExperience,
  profileDocuments,
  profileDocumentNote,
  profileContactDetail,
} from "../../../data";
import "../../../styles/variables.css";
import "./Profile.css";

/**
 * Profile (full page, "My Profile")
 *
 * Staff profile page. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page) around the teal
 * hero card, the 4-way tab strip, and whichever tab panel is active.
 * All fake data comes from data/profileData.js so it can be swapped
 * for API responses later without touching this file.
 *
 * This is also where the Topbar's avatar button lands: Topbar.jsx
 * navigates to this page's route by default when no onAvatarClick
 * override is passed in, the same way its bell icon defaults to the
 * Notifications route.
 */
const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState(profileTabs[0].id);

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic-information":
        return (
          <BasicInformationTab
            personal={profileBasicInfo.personal}
            guardian={profileBasicInfo.guardian}
            completion={profileCompletion}
          />
        );
      case "academic-detail":
        return (
          <AcademicDetailTab education={profileEducation} experience={profileExperience} />
        );
      case "document":
        return <DocumentTab documents={profileDocuments} note={profileDocumentNote} />;
      case "contact-details":
        return (
          <ContactDetailsTab
            contact={profileContactDetail.contact}
            address={profileContactDetail.address}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
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
                <img src={staffProfile.avatar} alt={staffProfile.name} className="profile-page__photo" />

                <div className="profile-page__hero-card">
                  <button type="button" className="profile-page__edit-btn">
                    <Pencil size={13} />
                    Edit Profile
                  </button>

                  <p className="profile-page__completed">
                    {staffProfile.profileCompletedPercent} % Profile Completed
                  </p>

                  <h1 className="profile-page__name">
                    {staffProfile.name} <span className="profile-page__role">({staffProfile.role})</span>
                  </h1>
                  <p className="profile-page__id">ID : {staffProfile.employeeId}</p>

                  <span className="profile-page__status">{staffProfile.status}</span>
                </div>
              </div>

              <ProfileTabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />

              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
