import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import ProfileTabs from "../ProfileTabs/ProfileTabs";
import BasicInformationTab from "../BasicInformationTab/BasicInformationTab";
import AcademicDetailTab from "../AcademicDetailTab/AcademicDetailTab";
import DocumentTab from "../DocumentTab/DocumentTab";
import ContactDetailsTab from "../GuardianDetailsTab/GuardianDetailsTab";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import { fetchAcademicDetails } from "../../../../../../api/trainer/academicService";
import { fetchInstructorProfile } from "../../../../../../api/trainer/profileService";
import {
  updateInstructorAddress,
  updateInstructorProfile,
  updateInstructorGuardian,
  updateInstructorAcademic,
} from "../../../../../../api/trainer/editServices";
import {
  getCompletionLabel,
  getCompletionChecklist,
} from "../../../data/getCompletionMeta";
import { fetchGuardianDetails } from "../../../../../../api/trainer/guardianService";
import {
  uploadInstructorDocuments,
  fetchInstructorDocuments,
  DOCUMENT_FIELD_MAP,
} from "../../../../../../api/trainer/documentService";
import { profileTabs, profileDocumentNote } from "../../../data";
import "../../../styles/variables.css";
import "./Profile.css";

/**
 * Profile (full page, "My Profile")
                  <div className="profile-page__hero-actions">
                    <button
                      type="button"
                      className="profile-page__edit-btn"
                      onClick={() => setShowEditModal(true)}
                    >
                      <Pencil size={13} />
                      Edit Profile
                    </button>

                    <p className="profile-page__completed">
                      {basicInfoLoading ? "—" : completionPercent} % Profile
                      Completed
                    </p>
                  </div>
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
  const [activeTab, setActiveTab] = useState(profileTabs[0].id);
  const [showEditModal, setShowEditModal] = useState(false);

  const [personal, setPersonal] = useState(null);
  const [contact, setContact] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [permanentAddress, setPermanentAddress] = useState(null);
  const [completionPercent, setCompletionPercent] = useState(0);
  const [instructorId, setInstructorId] = useState(null);
  const [completionChecklist, setCompletionChecklist] = useState([]);
  const [basicInfoLoading, setBasicInfoLoading] = useState(true);
  const [basicInfoError, setBasicInfoError] = useState(null);

  const [avatarUrl, setAvatarUrl] = useState(null);

  // const [guardians, setGuardians] = useState(profileGuardianDetail.guardians);
  // const [guardians, setGuardians] = useState(null);
  const [fatherDetails, setFatherDetails] = useState(null);
  const [motherDetails, setMotherDetails] = useState(null);
  const [guardianDetails, setGuardianDetails] = useState(null);
  const [guardiansLoading, setGuardiansLoading] = useState(true);
  const [guardiansError, setGuardiansError] = useState(null);
  const [activeGuardianIndex, setActiveGuardianIndex] = useState(0);

  const [education, setEducation] = useState(null);
  const [experience, setExperience] = useState(null);
  const [academicLoading, setAcademicLoading] = useState(true);
  const [academicError, setAcademicError] = useState(null);

  const INITIAL_DOCUMENTS = [
    {
      id: "doc-1",
      name: "Highest Qualification Document",
      required: false,
      uploaded: false,
      uploadedOn: "Not uploaded",
      status: null,
    },
    {
      id: "doc-2",
      name: "Past Experience letter",
      required: false,
      uploaded: false,
      uploadedOn: "Not uploaded",
      status: null,
    },
    {
      id: "doc-3",
      name: "PAN Card",
      required: true,
      uploaded: false,
      uploadedOn: "Not uploaded",
      status: null,
    },
    {
      id: "doc-4",
      name: "Aadhar Card",
      required: true,
      uploaded: false,
      uploadedOn: "Not uploaded",
      status: null,
    },
    {
      id: "doc-5",
      name: "Resume",
      required: true,
      uploaded: false,
      uploadedOn: "Not uploaded",
      status: null,
    },
  ];

  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);

  const mapDocumentsFromApi = (payload = {}) => {
    const raw = payload?.documents ?? payload?.data ?? payload ?? {};

    return INITIAL_DOCUMENTS.map((doc) => {
      const fieldName = DOCUMENT_FIELD_MAP[doc.id];

      const candidateValue =
        raw?.[fieldName] ??
        raw?.[fieldName?.toLowerCase?.()] ??
        raw?.[fieldName?.replace("instructor_", "")] ??
        raw?.documents?.[fieldName] ??
        raw?.documents?.[fieldName?.toLowerCase?.()] ??
        raw?.documents?.[fieldName?.replace("instructor_", "")] ??
        raw?.[doc.name] ??
        null;

      const value =
        typeof candidateValue === "string"
          ? { url: candidateValue }
          : (candidateValue ?? null);

      const url =
        typeof value === "string"
          ? value
          : (value?.url ??
            value?.fileUrl ??
            value?.downloadUrl ??
            value?.path ??
            null);

      const uploaded = Boolean(
        url ||
        value?.uploaded ||
        value?.isUploaded ||
        value?.status === "uploaded" ||
        value?.status === "Verified" ||
        value?.verified,
      );

      return {
        ...doc,
        uploaded,
        uploadedOn: uploaded
          ? value?.uploadedOn ||
            value?.updatedAt ||
            new Date().toLocaleDateString()
          : "Not uploaded",
        status: uploaded ? value?.status || "Verified" : null,
        url,
      };
    });
  };

  useEffect(() => {
    let cancelled = false;

    async function loadDocuments() {
      try {
        const payload = await fetchInstructorDocuments();
        if (!cancelled) {
          setDocuments(mapDocumentsFromApi(payload));
        }
      } catch (err) {
        console.warn("Failed to fetch instructor documents on page load", err);
      }
    }

    loadDocuments();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadBasicInfo() {
      setBasicInfoLoading(true);
      setBasicInfoError(null);
      try {
        const {
          profileCompletion,
          instructorId: fetchedInstructorId,
          profilePhoto,
          basicInformation,
        } = await fetchInstructorProfile();
        if (!cancelled) {
          setInstructorId(fetchedInstructorId);
          if (profilePhoto) setAvatarUrl(profilePhoto);
          setPersonal(basicInformation.personalInformation);
          setContact(basicInformation.contactDetails);
          setCurrentAddress(basicInformation.currentAddress);
          setPermanentAddress(basicInformation.permanentAddress);
          setCompletionPercent(profileCompletion);
          setCompletionChecklist(getCompletionChecklist(basicInformation));
        }
      } catch (err) {
        if (!cancelled)
          setBasicInfoError(err.message || "Failed to load profile");
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
        if (!cancelled)
          setAcademicError(err.message || "Failed to load academic details");
      } finally {
        if (!cancelled) setAcademicLoading(false);
      }
    }

    loadAcademicDetails();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadGuardiansDetails() {
      setGuardiansLoading(true);
      setGuardiansError(null);
      try {
        const details = await fetchGuardianDetails();
        if (!cancelled) {
          setFatherDetails(details.fatherDetails);
          setMotherDetails(details.motherDetails);
          setGuardianDetails(details.guardianDetails);
        }
      } catch (err) {
        if (!cancelled)
          setGuardiansError(err.message || "Failed to load guardian details");
      } finally {
        if (!cancelled) setGuardiansLoading(false);
      }
    }

    loadGuardiansDetails();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUploadDocument = async (doc, file) => {
    const fieldName = DOCUMENT_FIELD_MAP[doc.id];
    if (!fieldName) {
      throw new Error(`No backend field mapped for document "${doc.id}"`);
    }

    await uploadInstructorDocuments({ [fieldName]: file });

    // The POST is the upsert/create endpoint. We do not need a GET after
    // every file select; we just read once on page load and keep the page
    // hydrated from the backend response. The one initial load covers it.
    const payload = await fetchInstructorDocuments();
    setDocuments(mapDocumentsFromApi(payload));
  };

  const handleSaveProfile = async (updated) => {
    const profile = await updateInstructorProfile({
      personal: updated.personal,
      contact: updated.contact,
      photo: updated.avatarFile,
    });
    const address = await updateInstructorAddress({
      currentAddress: updated.currentAddress,
      permanentAddress: updated.permanentAddress,
    });
    const guardian = await updateInstructorGuardian({
      fatherDetails: updated.fatherDetails,
      motherDetails: updated.motherDetails,
      guardianDetails: updated.guardianDetails,
    });
    const academics = await updateInstructorAcademic({
      education: updated.education,
      experience: updated.experience,
    });
    const firstName = profile.first_name ?? updated.personal.firstName;
    const lastName = profile.last_name ?? updated.personal.lastName;

    setPersonal({
      ...personal,
      ...updated.personal,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      gender: profile.gender ?? updated.personal.gender,
      dob: profile.date_of_birth ?? updated.personal.dob,
      bloodGroup: profile.blood_group ?? updated.personal.bloodGroup,
      highestQualification:
        profile.highest_qualification ?? updated.personal.highestQualification,
      designation:
        profile.designation ??
        profile.instructor_designation ??
        updated.personal.designation,
    });
    setContact({
      ...contact,
      ...updated.contact,
      mobileNumber: profile.contact_number ?? updated.contact.mobileNumber,
      emergencyContactNumber:
        profile.emergency_contact ?? updated.contact.emergencyContactNumber,
    });
    setCurrentAddress({
      ...updated.currentAddress,
      ...(address.current_address ?? {}),
      line:
        address.current_address?.current_address ?? updated.currentAddress.line,
      state:
        address.current_address?.current_state ?? updated.currentAddress.state,
      city:
        address.current_address?.current_city ?? updated.currentAddress.city,
      district:
        address.current_address?.current_district ??
        updated.currentAddress.district,
      pinCode:
        address.current_address?.current_pincode ??
        updated.currentAddress.pinCode,
    });
    setPermanentAddress({
      ...updated.permanentAddress,
      ...(address.permanent_address ?? {}),
      line:
        address.permanent_address?.permanent_address ??
        updated.permanentAddress.line,
      state:
        address.permanent_address?.permanent_state ??
        updated.permanentAddress.state,
      city:
        address.permanent_address?.permanenet_city ??
        updated.permanentAddress.city,
      district:
        address.permanent_address?.permanent_district ??
        updated.permanentAddress.district,
      pinCode:
        address.permanent_address?.permanent_pincode ??
        updated.permanentAddress.pinCode,
    });
    setFatherDetails(guardian?.fatherDetails ?? updated.fatherDetails);
    setMotherDetails(guardian?.motherDetails ?? updated.motherDetails);
    setGuardianDetails(guardian?.guardianDetails ?? updated.guardianDetails);
    setEducation(academics.education ?? updated.education);
    setExperience(academics.experience ?? updated.experience);
    setAvatarUrl(profile.profile_photo ?? updated.avatarUrl ?? null);
    setShowEditModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic-information":
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
      case "academic-detail":
        if (academicLoading) return <p>Loading academic details…</p>;
        if (academicError) return <p>Error: {academicError}</p>;
        return (
          <AcademicDetailTab education={education} experience={experience} />
        );
      case "document":
        return (
          <DocumentTab
            documents={documents}
            note={profileDocumentNote}
            onUploadDocument={handleUploadDocument}
          />
        );
      case "guardian-details":
        if (guardiansLoading) return <p>Loading guardian details…</p>;
        if (guardiansError) return <p>Error: {guardiansError}</p>;
        return (
          <ContactDetailsTab
            father={fatherDetails}
            mother={motherDetails}
            guardian={guardianDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="staff-dashboard profile-screen">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="staff-dashboard__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="profile-page">
              <div className="profile-page__hero">
                <img
                  src={avatarUrl}
                  alt={personal?.name ?? "Profile"}
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
                    {basicInfoLoading ? "—" : completionPercent} % Profile
                    Completed
                  </p>

                  <h1 className="profile-page__name">
                    {personal?.name ?? (basicInfoLoading ? "Loading..." : "")}{" "}
                    <span className="profile-page__role">
                      {personal?.designation ? `(${personal.designation})` : ""}
                    </span>
                  </h1>
                  <p className="profile-page__id">
                    ID :{" "}
                    {instructorId ?? (basicInfoLoading ? "Loading..." : "")}
                  </p>

                  {!basicInfoLoading && personal?.status && (
                    <span className="profile-page__status">
                      {personal.status}
                    </span>
                  )}
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
          father={fatherDetails}
          mother={motherDetails}
          guardian={guardianDetails}
          activeGuardianIndex={activeGuardianIndex}
          education={education}
          experience={experience}
          avatarUrl={avatarUrl}
          onCancel={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default Profile;
