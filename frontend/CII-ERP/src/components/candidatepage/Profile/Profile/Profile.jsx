// Profile.jsx
// Root page — "My Profile" section. Composes the sidebar, topbar, identity
// header, tab navigation, and the four tab panels (personal info, academic
// detail, document, skills & links).

import { useState, useEffect } from "react";
import API from "../../../../../api/api";

import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";

import ProfileHeader from "../ProfileHeader/ProfileHeader";
import ProfileTabs from "../ProfileTabs/ProfileTabs";
import PersonalInfo from "../PersonalInfo/PersonalInfo";
import AcademicDetail from "../AcademicDetail/AcademicDetail";
import Document from "../Document/Document";
import Skills from "../Skills/Skills";

import "./Profile.css";
import orgLogo from "../../../../assets/Logo.png";
import {
  INITIAL_DOCUMENTS,
  INITIAL_SKILLS,
} from "../../../../data/profileData";

// ─── Mappers (pure functions, no hooks — safe at top level) ───────────────

function mapPersonalInfo(personalInfo) {
  if (!personalInfo) return null;

  return {
    fullName: [
      personalInfo.candidate_first_name,
      personalInfo.candidate_last_name,
    ]
      .filter(Boolean)
      .join(" "),
    guardianName: personalInfo.guardian_name ?? "-",
    phoneno: personalInfo.contact_number ?? "-",
    email: personalInfo.user_login?.user_email ?? "-",
    gender: personalInfo.gender ?? "-",
    dob: personalInfo.date_of_birth ?? "-",
    category: personalInfo.category ?? "-",
    bloodGroup: personalInfo.blood_group ?? "-",
    Qualification: personalInfo.highest_qualification ?? "-",
    mainaddress: personalInfo.candidate_address ?? "-",
    city: personalInfo.district ?? "-",
    state: personalInfo.state_name ?? "-",
    country: personalInfo.country ?? "India",
    pincode: personalInfo.pin_code ?? "-",
  };
}

function mapCandidateHeader(personalInfo, completionPct) {
  if (!personalInfo) return null;

  const fullName = [
    personalInfo.candidate_first_name,
    personalInfo.candidate_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    name: fullName || "Candidate",
    candidateId: personalInfo.candidate_id ?? personalInfo.id ?? "-",
    batch: personalInfo.batch ?? "-",
    status: personalInfo.status ?? "Active",
    avatarSrc: personalInfo.avatar_url ?? null,
    completionPct,
  };
}

function buildChecklist(info) {
  const items = [
    { label: "Basic Information", done: !!info?.fullName },
    { label: "Contact Details", done: !!(info?.phoneno && info?.email) },
    { label: "Address", done: !!info?.mainaddress },
    { label: "Date of Birth", done: !!info?.dob },
  ];
  const doneCount = items.filter((i) => i.done).length;
  const completionPct = Math.round((doneCount / items.length) * 100);
  return { checklist: items, completionPct };
}

function formatDate(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapAppliedCourses(academicDetails) {
  const courses = academicDetails?.courses ?? [];

  return courses.map((c, idx) => ({
    id: `${c.title ?? "course"}-${idx}`,
    title: c.title ?? "-",
    courseName: c.course ?? "-",
    mode: c.mode ?? "-",
    company: c.company ?? "-",
    location: c.location ?? "-",
    enrolledDate: formatDate(c.enrolled_date),
    startingDate: formatDate(c.starting_date),
    endDate: formatDate(c.end_date),
    trainerName: c.trainer_name ?? "-",
    supervisorName: c.supervisor_name ?? "-",
  }));
}

function formatDocumentDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapDocumentsFromApi(apiData, fallbackDocs = INITIAL_DOCUMENTS) {
  const docs = fallbackDocs.map((doc) => ({ ...doc }));
  const payload = apiData?.data ?? apiData ?? {};

  const urlByField = {
    passport_size_photo:
      payload.candidate_photo ?? payload.passport_size_photo ?? null,
    resume: payload.candidate_resume ?? payload.resume ?? null,
    pan_card: payload.candidate_pan_card ?? payload.pan_card ?? null,
    aadhar_card: payload.candidate_aadhar_card ?? payload.aadhar_card ?? null,
  };

  return docs.map((doc) => {
    const url = urlByField[doc.field];
    if (!url) return doc;

    return {
      ...doc,
      status: "verified",
      uploadedOn: doc.uploadedOn || formatDocumentDate(),
      url,
    };
  });
}

// ─── Component ─────────────────────────────────────────────────────────

export default function Profile() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [personalInfo, setPersonalInfo] = useState(null);
  const [academicDetails, setAcademicDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        const [profileRes, academicsRes, documentsRes] =
          await Promise.allSettled([
            API.get("candidate/candidate-profile"),
            API.get("candidate/candidate-academics"),
            API.post("candidate/candidate-documents", {}),
          ]);

        if (!cancelled) {
          if (profileRes.status === "fulfilled") {
            setPersonalInfo(profileRes.value.data?.data?.personalInfo ?? null);
          }

          if (academicsRes.status === "fulfilled") {
            setAcademicDetails(
              academicsRes.value.data?.data?.academicDetails ?? null,
            );
          }

          if (documentsRes.status === "fulfilled") {
            const payload =
              documentsRes.value.data?.data ?? documentsRes.value.data ?? {};
            setDocuments(mapDocumentsFromApi(payload, INITIAL_DOCUMENTS));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const mappedInfo = mapPersonalInfo(personalInfo);
  const { checklist, completionPct } = buildChecklist(mappedInfo);
  const candidateHeader = mapCandidateHeader(personalInfo, completionPct);
  const appliedCourses = mapAppliedCourses(academicDetails);

  const orgLogoSrc = orgLogo;

  if (error) {
    return (
      <div className="profile-page__error">
        Couldn't load your profile. Please try again.
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Sidebar
        orgLogoSrc={orgLogoSrc}
        activeItem="My Profile"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="profile-page__main">
        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials="AS"
          onMenuClick={() => setSidebarOpen((o) => !o)}
        />

        <main className="profile-page__body">
          {candidateHeader && <ProfileHeader candidate={candidateHeader} />}

          <ProfileTabs active={activeTab} onChange={setActiveTab} />

          {activeTab === "personal" && mappedInfo && (
            <PersonalInfo
              info={mappedInfo}
              checklist={checklist}
              completionPct={completionPct}
            />
          )}

          {activeTab === "academic" && (
            <AcademicDetail appliedCourses={appliedCourses} />
          )}

          {activeTab === "document" && (
            <Document documents={documents} onDocumentsChange={setDocuments} />
          )}

          {activeTab === "skills" && (
            <Skills skills={skills} onSkillsChange={setSkills} />
          )}
        </main>
      </div>
    </div>
  );
}
