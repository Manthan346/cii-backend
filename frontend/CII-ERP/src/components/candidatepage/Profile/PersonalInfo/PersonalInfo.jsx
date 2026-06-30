// PersonalInfo.jsx
// "personal info" tab: basic information grid + profile completion checklist.
//
// Props:
//   info        {object}  – { fullName, dob, gender, bloodGroup, guardianName, category }
//   checklist   {array}   – [{ label, done }]
//   completionPct {number}

import Icon from '../Icon/Icon';
import './PersonalInfo.css';

function Field({ label, value }) {
  return (
    <div className="personal-info__field">
      <div className="personal-info__field-label">{label}</div>
      <div className="personal-info__field-value">{value}</div>
    </div>
  );
}

export default function PersonalInfo({ info, checklist, completionPct }) {
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="personal-info">

      <div className="personal-info__card">
        <div className="personal-info__card-title">Basic Information</div>
        <div className="personal-info__grid">
          <Field label="FULL NAME" value={info.fullName} />
          <Field label="DATE OF BIRTH" value={info.dob} />
          <Field label="GENDER" value={info.gender} />
          <Field label="BLOOD GROUP" value={info.bloodGroup} />
          <Field label="FATHER'S /GAURDIAN'S NAME" value={info.guardianName} />
          <Field label="CATEGORY" value={info.category} />
        </div>
      </div>

      <div className="personal-info__side">
        <div className="personal-info__card-title">Profile completion</div>

        <div className="personal-info__donut-wrap">
          <svg className="personal-info__donut" viewBox="0 0 100 100">
            <circle className="personal-info__donut-bg" cx="50" cy="50" r="40" />
            <circle
              className="personal-info__donut-fg"
              cx="50" cy="50" r="40"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - completionPct / 100)}
            />
          </svg>
          <div className="personal-info__donut-label">{completionPct}%</div>
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

    </div>
  );
}
