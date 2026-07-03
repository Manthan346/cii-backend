// CertificateEligibility.jsx
// "Certificate Eligibility" panel — linear progress bars per criterion on
// the left, an overall eligibility ring + checklist on the right.
//
// Props:
//   overallPct  {number}  – Combined eligibility percentage for the ring.
//   criteria    {Array}   – [{ key, label, pct, requiredLabel, met }]
//   checklist   {Array}   – [{ label, met }]
//                           TODO: from /api/candidate/certificate-eligibility

import Icon from '../../shared/Icon/Icon';
import ProgressRing from '../../shared/ProgressRing/ProgressRing';
import './CertificateEligibility.css';

const GREEN  = '#0D6E50';
const ORANGE = '#B8892A';

function CriterionBar({ label, pct, requiredLabel, met }) {
  const barColor = met ? GREEN : ORANGE;
  return (
    <div className="cert-elig__criterion">
      <div className="cert-elig__criterion-head">
        <span className="cert-elig__criterion-label">{label}</span>
        <span className="cert-elig__criterion-pct">{pct}%</span>
      </div>
      <div className="cert-elig__track">
        <div
          className="cert-elig__fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <div className={`cert-elig__hint ${met ? 'cert-elig__hint--met' : 'cert-elig__hint--pending'}`}>
        <Icon name={met ? 'check' : 'alert'} size={11} color={met ? GREEN : ORANGE} />
        {requiredLabel}
      </div>
    </div>
  );
}

function ChecklistItem({ label, met }) {
  return (
    <div className={`cert-elig__check-item ${met ? 'cert-elig__check-item--met' : 'cert-elig__check-item--pending'}`}>
      <Icon name={met ? 'check' : 'alert'} size={13} color={met ? GREEN : ORANGE} />
      {label}
    </div>
  );
}

export default function CertificateEligibility({
  overallPct = 0,
  criteria = [],
  checklist = [],
}) {
  return (
    <div className="cert-elig">
      <div className="cert-elig__header">
        <Icon name="certificates" size={17} color="#1A2740" />
        <h3 className="cert-elig__title">Certificate Eligibility</h3>
      </div>

      <div className="cert-elig__body">
        <div className="cert-elig__criteria">
          {criteria.map(c => (
            <CriterionBar key={c.key} {...c} />
          ))}
        </div>

        <div className="cert-elig__divider" aria-hidden="true" />

        <div className="cert-elig__overall">
          <span className="cert-elig__overall-label">Overall Eligibility</span>
          <ProgressRing
            percent={overallPct}
            size={96}
            strokeWidth={9}
            color={GREEN}
            trackColor="#E6EEF8"
            showLabel
          />
          <div className="cert-elig__checklist">
            {checklist.map((item, i) => (
              <ChecklistItem key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
