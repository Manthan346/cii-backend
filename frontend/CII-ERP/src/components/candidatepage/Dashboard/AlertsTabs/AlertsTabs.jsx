// AlertsTabs.jsx
// Tabbed panel with "Alerts" and "Upcoming" tabs as shown in the screenshot.
// Skeleton lines shown in the Upcoming tab until data arrives.
//
// Props:
//   alerts    {Array}  – [{ text, meta }]  TODO: /api/candidate/alerts
//   upcoming  {Array}  – [{ text, meta }]  TODO: /api/candidate/upcoming

import { useState } from 'react';
import './AlertsTabs.css';

const DEFAULT_ALERTS = [
  { text: 'Assignment "Brand Identity" due tomorrow',  meta: 'Graphic Design · 2h ago'    },
  { text: 'New study material uploaded for Cyber Sec', meta: 'Academics · 5h ago'          },
  { text: "Attendance marked for today's session",     meta: 'Housekeeping · Today'        },
];

const DEFAULT_UPCOMING = [
  { text: 'Graphic Design live session',   meta: 'Tomorrow · 10:00 AM'   },
  { text: 'Cyber Security assessment',     meta: 'Wed, 02 Jul · 2:00 PM' },
  { text: 'Housekeeping practical test',   meta: 'Fri, 04 Jul · 11:00 AM'},
];

const TABS = ['Alerts', 'Upcoming'];

function ItemList({ items, dot }) {
  return items.map((item, i) => (
    <div key={i} className="alert-item">
      <span className={dot} aria-hidden="true" />
      <div>
        <div className="alert-item__text">{item.text}</div>
        <div className="alert-item__meta">{item.meta}</div>
      </div>
    </div>
  ));
}

export default function AlertsTabs({
  alerts   = DEFAULT_ALERTS,
  upcoming = DEFAULT_UPCOMING,
}) {
  const [activeTab, setActiveTab] = useState('Alerts');

  function handleTab(tab) {
    if (tab !== activeTab) setActiveTab(tab);
  }

  const offset = activeTab === 'Alerts' ? 0 : -50;

  return (
    <div className="alerts-tabs">
      <div className="alerts-tabs__bar" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`alerts-tabs__tab${activeTab === tab ? ' alerts-tabs__tab--active' : ''}`}
            onClick={() => handleTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="alerts-tabs__viewport">
        <div
          className="alerts-tabs__track"
          style={{ transform: `translateX(${offset}%)` }}
        >
          <div className="alerts-tabs__panel" role="tabpanel">
            <ItemList items={alerts}   dot="alert-item__dot" />
          </div>
          <div className="alerts-tabs__panel" role="tabpanel">
            <ItemList items={upcoming} dot="alert-item__dot alert-item__dot--upcoming" />
          </div>
        </div>
      </div>
    </div>
  );
}
