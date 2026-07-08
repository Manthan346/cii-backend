// ProfileTabs.jsx
// Pill-style tab navigation switching between profile sections.
//
// Props:
//   active    {string}    – Currently selected tab id.
//   onChange  {function}  – Callback(tabId) when a tab is clicked.

import './ProfileTabs.css';

const TABS = [
  { id: 'personal',  label: 'Personal Info'   },
  { id: 'academic',  label: 'Academic Detail' },
  { id: 'document',  label: 'Document'        },
  { id: 'skills',    label: 'Skill & Links'   },
];

export default function ProfileTabs({ active, onChange = () => {} }) {
  return (
    <div className="profile-tabs">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`profile-tabs__item${active === tab.id ? ' profile-tabs__item--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
