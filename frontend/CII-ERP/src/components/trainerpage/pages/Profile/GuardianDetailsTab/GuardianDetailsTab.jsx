import './GuardianDetailsTab.css';
import { useState } from 'react';

/**
 * GuardianDetailsTab
 *
 * "Guardian Details" tab content. Shows Guardian Information for the
 * active guardian, including a single flat `guardian.address` text
 * field (not the staff member's own address, which lives in Basic
 * Information as separate currentAddress/permanentAddress objects).
 */
export default function GuardianDetailsTab({ father, mother, guardian/*, activeIndex, onIndexChange*/ }) {
  const [activeKey, setActiveKey] = useState('father');

  const GUARDIAN_TABS = [
    { key: 'father', label: "Father's detail", data: father },
    { key: 'mother', label: "Mother's detail", data: mother },
    { key: 'guardian', label: "Guardian's detail", data: guardian },
  ];
  
  if (!father && !mother && !guardian) {
    return (
      <div className="guardian-details-tab">
        <p className="guardian-details-tab__empty">
          No guardian details added yet.
        </p>
      </div>
    );
  }

const activeGuardian = GUARDIAN_TABS.find((tab) => tab.key === activeKey)?.data;


  return (
    <div className="guardian-details-tab">
      <div className="guardian-details-tab__sub-tabs">
        {GUARDIAN_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`guardian-details-tab__sub-tab ${
              tab.key === activeKey ? 'guardian-details-tab__sub-tab--active' : ''
            }`}
            onClick={() => setActiveKey(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <h3 className="guardian-details-tab__heading">Guardian Information</h3>

      <div className="guardian-details-tab__grid">
        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Name</span>
          <span className="guardian-details-tab__value">{activeGuardian.name}</span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Relationship</span>
          <span className="guardian-details-tab__value">
            {activeKey === 'guardian'
              ? activeGuardian?.relationship
              : GUARDIAN_TABS.find((tab) => tab.key === activeKey)?.label.replace("'s detail", '')}
          </span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Mobile Number</span>
          <span className="guardian-details-tab__value">
            {activeGuardian.phone_no}
          </span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Occupation</span>
          <span className="guardian-details-tab__value">
            {activeGuardian.occupation}
          </span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Blood Group</span>
          <span className="guardian-details-tab__value">
            {activeGuardian.blood_group}
          </span>
        </div>

        <div className="guardian-details-tab__field">
          <span className="guardian-details-tab__label">Address</span>
          <span className="guardian-details-tab__value">
            {activeGuardian.address}
          </span>
        </div>
      </div>

      <div className="guardian-details-tab__nav">
        <button
          type="button"
          className="guardian-details-tab__nav-btn"
          onClick={() => {
            const i = GUARDIAN_TABS.findIndex((tab) => tab.key === activeKey);
            setActiveKey(GUARDIAN_TABS[i - 1].key);
          }}
          disabled={GUARDIAN_TABS.findIndex((tab) => tab.key === activeKey) === 0}
          aria-label="Previous guardian"
        >
          &lt;
        </button>
        <button
          type="button"
          className="guardian-details-tab__nav-btn"
          onClick={() => {
            const i = GUARDIAN_TABS.findIndex((tab) => tab.key === activeKey);
            setActiveKey(GUARDIAN_TABS[i + 1].key);
          }}
          disabled={GUARDIAN_TABS.findIndex((tab) => tab.key === activeKey) === GUARDIAN_TABS.length - 1}
          aria-label="Next guardian"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
