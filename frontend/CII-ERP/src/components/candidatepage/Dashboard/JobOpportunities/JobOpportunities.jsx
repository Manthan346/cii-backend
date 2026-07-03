// JobOpportunities.jsx
// Right-column panel listing relevant job opportunities.
//
// Props:
//   jobs  {Array}  – [{ role, company, location, logoSrc, accentColor }]
//                    TODO: populate from /api/jobs

import { Link } from 'react-router-dom';
import './JobOpportunities.css';

// Default data (replace with API)
const DEFAULT_JOBS = [
  {
    role:        'Graphic Design',
    company:     'Cosmos',
    location:    'Remote',
    logoSrc:     null,
    accentColor: '#7C3AED',
  },
  {
    role:        'Cyber Security',
    company:     'DSCI',
    location:    'Mumbai',
    logoSrc:     null,
    accentColor: '#0891B2',
  },
];

function JobCard({ role, company, location, logoSrc, accentColor }) {
  return (
    <div className="job-card">
      {/* Company logo – sourced from backend */}
      <div className="job-card__logo">
        {logoSrc
          ? <img src={logoSrc} alt={company} />
          : <div className="job-card__logo-bar" style={{ background: accentColor }} />
        }
      </div>

      <div className="job-card__role">{role}</div>

      <div className="job-card__meta">
        {/* Pin icon inline SVG (tiny, no extra dep) */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#6B7A94">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        {company}
        <span className="job-card__meta-dot" />
        {location}
      </div>
    </div>
  );
}

export default function JobOpportunities({ jobs = DEFAULT_JOBS }) {
  return (
    <div className="job-opportunities">
      <div className="job-opportunities__header">
        <span className="job-opportunities__title">Job Opportunities</span>
        <Link to="/job-opportunities" className="job-opportunities__view-all">
          View all
        </Link>
      </div>
      {jobs.map((job, i) => (
        <JobCard key={i} {...job} />
      ))}
    </div>
  );
}
