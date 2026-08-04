// PersonalInfo.jsx
// "personal info" tab: basic information grid + profile completion checklist.
//
// Props:
//   info        {object}  – { fullName, dob, gender, bloodGroup, guardianName, category }
//   checklist   {array}   – [{ label, done }]
//   completionPct {number}

import { useEffect, useState } from 'react';
import Icon from '../../shared/Icon/Icon';
import './PersonalInfo.css';

const DONUT_R = 40;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_R;

// Animates the completion donut + percentage label from 0 up to
// completionPct on mount (ease-out cubic).
function useDonutAnimation(completionPct, duration = 1200) {
  const [displayPct, setDisplayPct] = useState(0);
  const [offset, setOffset] = useState(DONUT_CIRCUMFERENCE);

  useEffect(() => {
    let raf;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * completionPct);
      setDisplayPct(value);
      setOffset(DONUT_CIRCUMFERENCE * (1 - value / 100));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [completionPct]);

  return { displayPct, offset };
}

function Field({ label, value }) {
  return (
    <div className="personal-info__field">
      <div className="personal-info__field-label">{label}</div>
      <div className="personal-info__field-value">{value}</div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function PersonalInfo({ info, checklist, completionPct }) {
  const { displayPct, offset } = useDonutAnimation(completionPct);

  return (
    <div className="personal-info">

      <div className="personal-info__card">
        <div className="personal-info__card-title">Basic Information</div>
        <div className="personal-info__grid">
          <Field label="FULL NAME" value={info.fullName} />
          <Field label="FATHER'S /GAURDIAN'S NAME" value={info.guardianName} />
          <Field label="PHONE NUMBER" value={info.phoneno} />
          <Field label="EMAIL-ID" value={info.email} />
          <Field label="GENDER" value={info.gender} />
          <Field label="DATE OF BIRTH" value={formatDate(info.dob)} />
          <Field label="CATEGORY" value={info.category} />
          <Field label="BLOOD GROUP" value={info.bloodGroup} />
          <Field label="HIGHEST QUALIFICATION" value={info.Qualification} />
        </div>
      </div>

      <div className="personal-info__side">
        <div className="personal-info__card-title">Profile completion</div>

        <div className="personal-info__donut-wrap">
          <svg className="personal-info__donut" viewBox="0 0 100 100">
            <circle className="personal-info__donut-bg" cx="50" cy="50" r={DONUT_R} />
            <circle
              className="personal-info__donut-fg"
              cx="50" cy="50" r={DONUT_R}
              strokeDasharray={DONUT_CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="personal-info__donut-label">{displayPct}%</div>
        </div>

        <div className="personal-info__almost">Almost There!!</div>

        <ul className="personal-info__checklist">
          {checklist.map(item => (
            <li key={item.label} className={item.done ? 'is-done' : 'is-pending'}>
              <Icon
                name={item.done ? 'check' : 'alert'}
                size={14}
                color={item.done ? 'var(--green)' : 'var(--orange)'}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="personal-info__card">
        <div className="personal-info__card-title">Address</div>
        <div className="personal-info__grid_mainaddress">
          <Field value={info.mainaddress} />
        </div>
        <div className="personal-info__grid_address">
          <Field label="CITY" value={info.city} />
          <Field label="STATE" value={info.state} />
          <Field label="COUNTRY" value={info.country} />
          <Field label="PINCODE" value={info.pincode} />
        </div>
      </div>

    </div>
  );
}
