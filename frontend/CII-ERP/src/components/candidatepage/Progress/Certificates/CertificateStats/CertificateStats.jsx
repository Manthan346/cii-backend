// ============================================================================
// CertificateStats.jsx
// ----------------------------------------------------------------------------
// The row of solid-blue stat cards at the top of the Certificates page.
//
// NOTE ON REUSE: the rest of the app's stat cards (see the Assessments page)
// use the shared <StatCard /> component, which renders a white card with a
// small colored icon chip. This page's design uses a different visual style
// (solid blue background, white icon+text), so a local, page-specific card
// is used here instead of forcing a mismatched look onto the shared
// component. If you'd like full reuse, the cleanest approach is to add a
// `variant="solid"` prop to shared/StatCard so both designs can share one
// component — happy to wire that up if useful.
//
// BACKEND NOTE: `stats` is passed down from Certificates.jsx after fetching
// GET /api/candidates/:id/certificates/stats?type=courses|workshops
// ============================================================================

import React from "react";
import Icon from "../../../shared/Icon/Icon";
import "./CertificateStats.css";

const CertificateStats = ({ stats = [] }) => {
  return (
    <div className="certificate-stats">
      {stats.map((stat) => (
        <div className="certificate-stat-card" key={stat.id}>
          <Icon
            name={stat.icon}
            size={22}
            color="currentColor"
            className="certificate-stat-card__icon"
          />
          <p className="certificate-stat-card__value">{stat.value}</p>
          <p className="certificate-stat-card__label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CertificateStats;

// import React from "react";
// import Icon from "../../../shared/Icon/Icon";
// // import { ICON_PATHS } from "../certificateIcons";
// import "./CertificateStats.css";

// const CertificateStats = ({ stats = [] }) => {
//   return (
//     <div className="certificate-stats">
//       {stats.map((stat) => (
//         <div className="certificate-stat-card" key={stat.id}>
//           <svg
//             className="certificate-stat-card__icon"
//             width="22"
//             height="22"
//             viewBox="0 0 24 24"
//             fill="none"
//           >
//             <path d={ICON_PATHS[stat.icon]} fill="currentColor" />
//           </svg>
//           <p className="certificate-stat-card__value">{stat.value}</p>
//           <p className="certificate-stat-card__label">{stat.label}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CertificateStats;
