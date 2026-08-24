import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import Tabs from '../../shared/Tabs/Tabs';
import InfoField from '../../shared/InfoField/InfoField';
import './GuardianDetailsPanel.css';

const SUB_TABS = [
  { id: 'father', label: "Father's detail" },
  { id: 'mother', label: "Mother's detail" },
  { id: 'guardian', label: "Guardian's detail" },
];

/**
 * GuardianDetailsPanel
 *
 * Content shown under Profile's "Guardian Details" tab: a
 * Father's/Mother's/Guardian's sub-tab switch, plus prev/next arrows
 * at the bottom that cycle through the same three sub-tabs (a
 * secondary way to move between them, matching the reference design).
 *
 * Props:
 *  - guardians: { father, mother, guardian } - each a
 *               { name, relationship, mobile, occupation, bloodGroup, address }
 *               see data/profileData.js -> profileData.guardians for the shape.
 */
const GuardianDetailsPanel = ({ guardians }) => {
  const [activeSubTab, setActiveSubTab] = useState('father');
  const activeIndex = SUB_TABS.findIndex((t) => t.id === activeSubTab);
  const activeGuardian = guardians[activeSubTab] || {};

  const goTo = (delta) => {
    const nextIndex = (activeIndex + delta + SUB_TABS.length) % SUB_TABS.length;
    setActiveSubTab(SUB_TABS[nextIndex].id);
  };

  return (
    <SectionCard>
      <Tabs
        variant="pills"
        tabs={SUB_TABS}
        activeId={activeSubTab}
        onChange={setActiveSubTab}
      />

      <h3 className="admin-guardian-panel__heading">Guardian Information</h3>

      <div className="admin-guardian-panel__grid">
        <InfoField label="Name" value={activeGuardian.name} />
        <InfoField label="Relationship" value={activeGuardian.relationship} />
        <InfoField label="Mobile Number" value={activeGuardian.mobile} />
        <InfoField label="Occupation" value={activeGuardian.occupation} />
        <InfoField label="Blood Group" value={activeGuardian.bloodGroup} />
        <InfoField label="Address" value={activeGuardian.address} />
      </div>

      <div className="admin-guardian-panel__pager">
        <button
          type="button"
          className="admin-guardian-panel__pager-btn"
          onClick={() => goTo(-1)}
          aria-label="Previous guardian"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="admin-guardian-panel__pager-btn"
          onClick={() => goTo(1)}
          aria-label="Next guardian"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </SectionCard>
  );
};

export default GuardianDetailsPanel;
