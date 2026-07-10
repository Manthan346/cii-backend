// ============================================================================
// CertificateTabs.jsx
// ----------------------------------------------------------------------------
// The "Courses" / "Workshops" pill switcher. Clicking a tab calls
// onChange(tabKey) so the parent (Certificates.jsx) can swap which stats +
// certificate list are shown, per the two reference screenshots.
// ============================================================================

import React from "react";
import "./CertificateTabs.css";

const TABS = [
  { key: "courses", label: "Courses" },
  { key: "workshops", label: "Workshops" },
];

const CertificateTabs = ({ activeTab, onChange }) => {
  return (
    <div className="certificate-tabs" role="tablist" aria-label="Certificate category">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`certificate-tabs__pill ${isActive ? "certificate-tabs__pill--active" : ""}`}
            onClick={() => onChange && onChange(tab.key)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CertificateTabs;
