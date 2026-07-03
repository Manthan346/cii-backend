// UnlockCertificate.jsx
// "Unlock Your Course Certifcate" panel — static guidance card explaining
// what a candidate needs to do to unlock certification.
//
// Props:
//   title         {string}  – Panel heading.
//   subtitle      {string}  – Small grey line under the heading.
//   heading       {string}  – Bold "How to unlock..." line.
//   requirements  {Array}   – List of requirement strings.
//   onViewClick   {function}– Optional handler for the "View" link.
//                             TODO: wire to a certification-requirements
//                             detail page/modal when available.

import './UnlockCertificate.css';

export default function UnlockCertificate({
  title = 'Unlock Your Course Certifcate',
  subtitle = 'Reach 100% for completion of each course',
  heading = 'How to unlock to course certification',
  requirements = [],
  onViewClick,
}) {
  return (
    <div className="unlock-cert">
      <div className="unlock-cert__header">
        <h3 className="unlock-cert__title">{title}</h3>
        <button
          type="button"
          className="unlock-cert__view"
          onClick={onViewClick}
        >
          View
        </button>
      </div>

      <p className="unlock-cert__subtitle">{subtitle}</p>

      <p className="unlock-cert__heading">{heading}</p>

      <ul className="unlock-cert__list">
        {requirements.map((req, i) => (
          <li key={i} className="unlock-cert__list-item">{req}</li>
        ))}
      </ul>
    </div>
  );
}
