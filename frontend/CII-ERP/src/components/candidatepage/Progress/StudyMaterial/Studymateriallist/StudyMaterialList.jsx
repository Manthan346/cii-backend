// StudyMaterialList.jsx
// "Study Materials" page content — search/filter toolbar + date-grouped
// list of course notes/files, each linking out to Drive.
//
// Props:
//   search         {string}
//   onSearch       {function}
//   courseOptions  {array}    – [{ value, label }]
//   course         {string}
//   onCourseChange {function}
//   groups         {array}    – [{ label, items: [{ id, type, title, course, uploader, date, driveUrl }] }]
//   loading        {boolean}
//   error          {any}

import Icon from '../../../shared/Icon/Icon';
import './StudyMaterialList.css';

const FILE_TYPE_LABEL = {
  pdf: 'PDF',
  ppt: 'PPT',
  doc: 'DOC',
  xls: 'XLS',
};

function MaterialCard({ type, title, course, uploader, date, driveUrl }) {
  return (
    <div className="material-card">
      <div className="material-card__badge">
        {FILE_TYPE_LABEL[type] || type.toUpperCase()}
      </div>

      <div className="material-card__body">
        <div className="material-card__title">{title}</div>
        <div className="material-card__meta">
          <span>{course}</span>
          <span className="material-card__meta-sep">
            <Icon name="person" size={12} color="var(--ink-soft)" />
            {uploader}
          </span>
          <span>{date}</span>
        </div>
      </div>

      <a className="material-card__drive" href={driveUrl} target="_blank" rel="noreferrer">
        <Icon name="share" size={13} color="var(--white)" />
        Open Drive
      </a>
    </div>
  );
}

export default function StudyMaterialList({
  search = '',
  onSearch = () => {},
  courseOptions = [],
  course = '',
  onCourseChange = () => {},
  groups = [],
  loading = false,
  error = null,
}) {
  return (
    <div className="study-material">
      <h1 className="study-material__title">Study Materials</h1>
      <p className="study-material__subtitle">Study materials across all courses</p>

      <div className="study-material__toolbar">
        <div className="study-material__search">
          <Icon name="search" size={16} color="var(--ink-soft)" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search notes by name..."
          />
        </div>

        <select
          className="study-material__course-select"
          value={course}
          onChange={(e) => onCourseChange(e.target.value)}
        >
          <option value="">All courses</option>
          {courseOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="study-material__list">
        {loading ? (
          <div className="study-material__loading">Loading study materials…</div>
        ) : error ? (
          <div className="study-material__error">Couldn't load study materials. Please try again.</div>
        ) : groups.length === 0 ? (
          <div className="study-material__empty">No study materials yet.</div>
        ) : (
          groups.map(group => (
            <div className="study-material__group" key={group.label}>
              <div className="study-material__group-label">{group.label}</div>
              {group.items.map(item => (
                <MaterialCard key={item.id} {...item} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}