// ============================================================================
// Certificates.jsx
// ----------------------------------------------------------------------------
// Main "Certificates" page (Progress > Certificates in the sidebar).
// Same page-shell pattern as the other candidate pages:
//
//   <Sidebar />  <Topbar />
//                <page content>
//
// Composition (each imported from its own component folder):
//   - CertificateStats/  -> top row of solid-blue stat cards
//   - CertificateTabs/   -> "Courses" / "Workshops" pill switcher
//   - CertificateGrid/   -> grid of CertificateCard for the active tab
//     - CertificateCard/
//       - CertifiedBadge/
//
// PROP NOTES (matched to your existing Sidebar.jsx / Topbar.jsx):
//   <Sidebar isOpen={sidebarOpen} onClose={...} activeItem="Certificates" />
//     - activeItem is compared against each NAV_MAIN item's `label`
//       (see Sidebar.jsx: `active={activeItem === item.label}`), so this
//       must match the sidebar's nav label exactly ("Certificates").
//   <Topbar onMenuClick={...} search={search} onSearch={setSearch} userInitials="AS" />
//     - Confirm these prop names against your actual Topbar.jsx signature
//       (the file shows onMenuClick, search/onSearch, and userInitials being
//       used inside the component — adjust here if it differs).
//
// BACKEND INTEGRATION:
// Replace the local useState(mockData) calls with real fetches, e.g.:
//
//   const [stats, setStats] = useState([]);
//   const [certificates, setCertificates] = useState([]);
//
//   useEffect(() => {
//     let isMounted = true;
//     Promise.all([
//       fetch(`/api/candidates/${candidateId}/certificates/stats?type=${activeTab}`).then((r) => r.json()),
//       fetch(`/api/candidates/${candidateId}/certificates?type=${activeTab}`).then((r) => r.json()),
//     ]).then(([statsRes, certsRes]) => {
//       if (!isMounted) return;
//       setStats(statsRes);
//       setCertificates(certsRes);
//     });
//     return () => { isMounted = false; };
//   }, [candidateId, activeTab]);
//
// Then pass `stats` / `certificates` down instead of relying on the local
// mock-data fallbacks in certificatesData.js.
// ============================================================================

import React, { useEffect, useState } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";

import CertificateStats from "../CertificateStats/CertificateStats";
import CertificateTabs from "../CertificateTabs/CertificateTabs";
import CertificateGrid from "../CertificateGrid/CertificateGrid";

import { fetchCandidateCertificates } from "../../../../../services/certificateService";
import "./Certificates.css";

import orgLogo from "../../../../../assets/Logo.png";

const Certificates = () => {
  // Local UI state. Replace `certificates`/`stats` derivations with real
  // fetched state (see BACKEND INTEGRATION comment above) once ready.
  const [activeTab, setActiveTab] = useState("courses"); // 'courses' | 'workshops'
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchCandidateCertificates()
      .then((items) => {
        if (isMounted) setCertificates(items);
      })
      .catch(() => {
        if (isMounted) setLoadError("Unable to load your certificates.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCertificates = activeTab === "courses" ? certificates : [];
  const stats = [
    {
      id: "earned",
      icon: "certificate",
      value: String(visibleCertificates.length),
      label: "Certificate earned",
    },
  ];

  // BACKEND NOTE: wire this to the real download endpoint, e.g.
  //   window.open(`/api/certificates/${certificate.id}/download`, "_blank");
  const handleDownload = (certificate) => {
    if (certificate.certificateUrl)
      window.open(certificate.certificateUrl, "_blank");
  };

  // BACKEND NOTE: wire this to POST /api/certificates/:id/share
  const handleShare = (certificate) => {
    console.log("Share certificate:", certificate.id);
  };

  return (
    <div className="certificates-page">
      <Sidebar
        orgLogoSrc={orgLogo}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Certificates"
      />
      {/* Mobile drawer scrim — see Sidebar.jsx's own usage comment.
          Only visible under the 900px breakpoint where Sidebar.css turns
          the sidebar into an off-canvas drawer. */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="certificates-page__main">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          search={search}
          onSearch={setSearch}
          userInitials="AS"
        />

        <div className="certificates-page__content">
          <header className="certificates-page__header">
            <h1 className="certificates-page__title">Certificates</h1>
            <p className="certificates-page__subtitle">
              Your earned credentials, ready to Download or share
            </p>
          </header>

          <CertificateStats stats={stats} />

          <CertificateTabs activeTab={activeTab} onChange={setActiveTab} />

          {loadError && <p role="alert">{loadError}</p>}
          {isLoading && <p>Loading certificates...</p>}
          <CertificateGrid
            items={isLoading || loadError ? [] : visibleCertificates}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        </div>
      </div>
    </div>
  );
};

export default Certificates;
