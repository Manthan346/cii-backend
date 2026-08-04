// AlertsTabs.jsx
// Single-panel Alerts list. The "Upcoming" tab has been removed per product
// request — this component no longer accepts or renders an `upcoming` prop.
// Header now matches the same left-title / right-"View all" pattern used by
// My Courses and Job Opportunities.
//
// Props:
//   alerts  {Array}  – [{ text, meta }]  TODO: /api/candidate/alerts

import { Link } from 'react-router-dom';
import './AlertsTabs.css';

const DEFAULT_ALERTS = [
  { text: 'Assignment "Brand Identity" due tomorrow',  meta: 'Graphic Design · 2h ago'    },
  { text: 'New study material uploaded for Cyber Sec', meta: 'Academics · 5h ago'          },
  { text: "Attendance marked for today's session",     meta: 'Housekeeping · Today'        },
];

function ItemList({ items }) {
  return items.map((item, i) => (
    <div key={i} className="alert-item">
      <span className="alert-item__dot" aria-hidden="true" />
      <div>
        <div className="alert-item__text">{item.text}</div>
        <div className="alert-item__meta">{item.meta}</div>
      </div>
    </div>
  ));
}

export default function AlertsTabs({ alerts = DEFAULT_ALERTS }) {
  return (
    <div className="alerts-tabs">
      <div className="alerts-tabs__header">
        <span className="alerts-tabs__title">Alerts</span>
        <Link to="/alerts" className="alerts-tabs__view-all">
          View all
        </Link>
      </div>

      <div className="alerts-tabs__panel">
        <ItemList items={alerts} />
      </div>
    </div>
  );
}