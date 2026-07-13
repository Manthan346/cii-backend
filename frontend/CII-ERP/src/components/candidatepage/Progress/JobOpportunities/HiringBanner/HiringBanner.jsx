// ============================================================================
// HiringBanner.jsx
// ----------------------------------------------------------------------------
// The yellow "WE'RE HIRING" illustration (spotlight + chair) shown at the
// top of every job card. Built as a single self-contained SVG so it has no
// external image dependency.
//
// If a specific company logo/banner image should replace this per job in
// the future, swap this component out for an <img src={job.bannerUrl} />
// with this SVG kept as a graceful fallback when no image is provided.
// ============================================================================

import React from "react";
import "./HiringBanner.css";

const HiringBanner = () => {
  return (
    <div className="hiring-banner">
      <svg
        viewBox="0 0 280 160"
        className="hiring-banner__svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect x="0" y="0" width="280" height="160" rx="14" fill="#F5C542" />

        {/* Ceiling cord */}
        <line x1="140" y1="0" x2="140" y2="34" stroke="#2B2B2B" strokeWidth="2" />

        {/* Light fixture */}
        <circle cx="140" cy="38" r="6" fill="#2B2B2B" />

        {/* Spotlight cone */}
        <polygon points="140,44 90,120 190,120" fill="#FFFFFF" opacity="0.35" />

        {/* Chair silhouette */}
        <g fill="#2B2B2B">
          {/* backrest */}
          <rect x="122" y="78" width="8" height="34" rx="2" />
          {/* seat */}
          <rect x="118" y="108" width="44" height="8" rx="2" />
          {/* front legs */}
          <rect x="120" y="116" width="5" height="16" />
          <rect x="155" y="116" width="5" height="16" />
          {/* back leg (angled, simplified) */}
          <rect x="122" y="112" width="5" height="20" transform="rotate(8 122 112)" />
        </g>

        {/* "WE'RE HIRING" caption */}
        <text
          x="140"
          y="70"
          textAnchor="middle"
          fontFamily="'Courier New', monospace"
          fontWeight="700"
          fontSize="17"
          letterSpacing="1"
          fill="#2B2B2B"
        >
          WE&apos;RE HIRING
        </text>
      </svg>
    </div>
  );
};

export default HiringBanner;
