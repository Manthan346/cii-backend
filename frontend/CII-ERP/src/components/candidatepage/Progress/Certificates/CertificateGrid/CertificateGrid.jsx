// ============================================================================
// CertificateGrid.jsx
// ----------------------------------------------------------------------------
// Renders the list of <CertificateCard /> items for whichever tab
// (Courses / Workshops) is currently active.
//
// BACKEND NOTE: `items` is passed down from Certificates.jsx after fetching
// GET /api/candidates/:id/certificates?type=courses|workshops
// ============================================================================

import React from "react";
import CertificateCard from "../CertificateCard/CertificateCard";
import "./CertificateGrid.css";

const CertificateGrid = ({ items = [], onDownload, onShare }) => {
  if (items.length === 0) {
    return (
      <p className="certificate-grid__empty">
        No certificates in this category yet.
      </p>
    );
  }

  return (
    <div className="certificate-grid">
      {items.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onDownload={onDownload}
          onShare={onShare}
        />
      ))}
    </div>
  );
};

export default CertificateGrid;
