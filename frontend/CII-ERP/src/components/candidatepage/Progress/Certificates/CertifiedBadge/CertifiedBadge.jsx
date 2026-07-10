// ============================================================================
// CertifiedBadge.jsx
// ----------------------------------------------------------------------------
// The circular "shield + checkmark" stamp with a "CERTIFIED" caption shown
// inside the white preview area at the top of every certificate card.
//
// This is a standalone SVG (not routed through the shared <Icon /> component)
// because it's a two-part graphic (icon + caption text), specific to this
// page. The path data also lives in certificateIcons.js (ICON_PATHS.certificate)
// if you'd rather wire it into the shared Icon component instead.
// ============================================================================

import React from "react";
import "./CertifiedBadge.css";

const CertifiedBadge = ({ size = 56 }) => {
  return (
    <div className="certified-badge">
      <svg
        className="certified-badge__icon"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.5 13.5L7 11l1.41-1.41L10.5 11.67l5.09-5.09L17 8l-6.5 6.5z"
          fill="currentColor"
        />
      </svg>
      <span className="certified-badge__label">CERTIFIED</span>
    </div>
  );
};

export default CertifiedBadge;
