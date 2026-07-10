// ============================================================================
// CertificateCard.jsx
// ----------------------------------------------------------------------------
// A single certificate card: preview area with <CertifiedBadge />, title,
// issued/duration line, grade pill, Download button, and Share icon button.
//
// BACKEND NOTE:
//   onDownload -> should trigger the actual file download, e.g.:
//     const handleDownload = () => window.open(`/api/certificates/${cert.id}/download`, "_blank");
//   onShare -> should call the share/share-to-profile endpoint, e.g.:
//     const handleShare = () => fetch(`/api/certificates/${cert.id}/share`, { method: "POST" });
// ============================================================================

import React from "react";
import CertifiedBadge from "../CertifiedBadge/CertifiedBadge";
import Icon from "../../../shared/Icon/Icon";
import "./CertificateCard.css";

const CertificateCard = ({ certificate, onDownload, onShare }) => {
  const { title, subtitle, grade } = certificate;

  return (
    <div className="certificate-card">
      <div className="certificate-card__preview">
        <CertifiedBadge size={56} />
      </div>

      <h3 className="certificate-card__title">{title}</h3>
      <p className="certificate-card__subtitle">{subtitle}</p>

      <span className="certificate-card__grade">{grade}</span>

      <div className="certificate-card__actions">
        <button
          type="button"
          className="certificate-card__download"
          onClick={() => onDownload && onDownload(certificate)}
        >
          Download
        </button>

        <button
          type="button"
          className="certificate-card__share"
          aria-label={`Share ${title}`}
          onClick={() => onShare && onShare(certificate)}
        >
          <Icon name="share" size={16} color="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;

// import React from "react";
// import CertifiedBadge from "../CertifiedBadge/CertifiedBadge";
// import icon from "../../../shared/Icon/Icon";
// import "./CertificateCard.css";

// const CertificateCard = ({ certificate, onDownload, onShare }) => {
//   const { title, subtitle, grade } = certificate;

//   return (
//     <div className="certificate-card">
//       <div className="certificate-card__preview">
//         <CertifiedBadge size={56} />
//       </div>

//       <h3 className="certificate-card__title">{title}</h3>
//       <p className="certificate-card__subtitle">{subtitle}</p>

//       <span className="certificate-card__grade">{grade}</span>

//       <div className="certificate-card__actions">
//         <button
//           type="button"
//           className="certificate-card__download"
//           onClick={() => onDownload && onDownload(certificate)}
//         >
//           Download
//         </button>

//         <button
//           type="button"
//           className="certificate-card__share"
//           aria-label={`Share ${title}`}
//           onClick={() => onShare && onShare(certificate)}
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//             <path d={ICON_PATHS.share} fill="currentColor" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CertificateCard;
