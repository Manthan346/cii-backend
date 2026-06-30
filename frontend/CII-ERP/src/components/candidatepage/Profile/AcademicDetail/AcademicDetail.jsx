// AcademicDetail.jsx
// "Academic Detail" tab: current program grid + snapshot quick-links.
//
// Props:
//   academic  {object}  – { program, batch, enrollmentDate, expectedCompletion, mentor, mode }
//   snapshot  {array}   – [{ icon, label }]

import Icon from '../Icon/Icon';
import './AcademicDetail.css';

function Field({ label, value }) {
  return (
    <div className="academic-detail__field">
      <div className="academic-detail__field-label">{label}</div>
      <div className="academic-detail__field-value">{value}</div>
    </div>
  );
}

export default function AcademicDetail({ academic, snapshot }) {
  return (
    <div className="academic-detail">

      <div className="academic-detail__card">
        <div className="academic-detail__card-title">Current Program</div>
        <div className="academic-detail__grid">
          <Field label="PROGRAM" value={academic.program} />
          <Field label="BATCH" value={academic.batch} />
          <Field label="ENROLLMENT DATE" value={academic.enrollmentDate} />
          <Field label="EXPECTED COMPLETION" value={academic.expectedCompletion} />
          <Field label="MENTOR" value={academic.mentor} />
          <Field label="MODE" value={academic.mode} />
        </div>
      </div>

      <div className="academic-detail__side">
        <div className="academic-detail__card-title">SnapShot</div>
        <div className="academic-detail__snapshot-list">
          {snapshot.map(item => (
            <button key={item.label} className="academic-detail__snapshot-item">
              <Icon name={item.icon} size={20} color="var(--blue)" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
