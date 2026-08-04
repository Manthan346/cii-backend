// GuardianDetails.jsx
// "Guardian Details" tab — pill switcher between Father / Mother / Guardian.
//
// Props:
//   guardian {object|null} – { father, mother, guardian } each either
//                             null or { name, relationship, gender,
//                             bloodGroup, occupation, address, phone, dob }

import { useState } from 'react';
import './GuardianDetails.css';

const SECTIONS = [
  { key: 'father',   label: '1. Guardian detail' },
  { key: 'mother',   label: '2. Guardian detail' },
  { key: 'guardian', label: '3. Guardian detail' },
];

function Field({ label, value }) {
  return (
    <div className="guardian-details__field">
      <div className="guardian-details__field-label">{label}</div>
      <div className="guardian-details__field-value">{value}</div>
    </div>
  );
}

export default function GuardianDetails({ guardian }) {
  const [activeSection, setActiveSection] = useState('father');

  const hasAny =
    guardian && (guardian.father || guardian.mother || guardian.guardian);

  if (!hasAny) {
    return (
      <div className="guardian-details">
        <div className="guardian-details__card">
          <div className="guardian-details__empty">
            No guardian details added yet.
          </div>
        </div>
      </div>
    );
  }

  const current = guardian[activeSection];

  return (
    <div className="guardian-details">
      <div className="guardian-details__pills">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            className={`guardian-details__pill${
              activeSection === s.key ? ' guardian-details__pill--active' : ''
            }`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="guardian-details__card">
        {current ? (
          <>
            <div className="guardian-details__badge">
              {current.relationship}
            </div>
            <div className="guardian-details__grid">
              <Field label="Name" value={current.name} />
              <Field label="Occupation" value={current.occupation} />
              <Field label="Relationship" value={current.relationship} />
              <Field label="Address" value={current.address} />
              <Field label="Gender" value={current.gender} />
              <Field label="Mobile Number" value={current.phone} />
              <Field label="Blood Group" value={current.bloodGroup} />
              <Field label="Date of birth" value={current.dob} />
            </div>
          </>
        ) : (
          <div className="guardian-details__empty">
            No details added for this section.
          </div>
        )}
      </div>
    </div>
  );
}