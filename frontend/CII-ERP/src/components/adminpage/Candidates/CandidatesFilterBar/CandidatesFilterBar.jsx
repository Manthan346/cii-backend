import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import Dropdown from '../../shared/Dropdown/Dropdown';
import './CandidatesFilterBar.css';

/**
 * CandidatesFilterBar
 *
 * Search + Course + Company + Attendance + Certificates filters for
 * the Candidates table. Unlike Total Users, this filter bar has no
 * explicit "Apply" button - each change is expected to filter the
 * table immediately, so this stays a fully controlled component with
 * no local submit state.
 *
 * Props:
 *  - search: string
 *  - onSearchChange: function(value)
 *  - course / onCourseChange
 *  - company / onCompanyChange
 *  - attendance / onAttendanceChange
 *  - certificate / onCertificateChange
 *  - courseOptions / companyOptions / attendanceOptions / certificateOptions:
 *    array of { value, label }
 */
const CandidatesFilterBar = ({
  search,
  onSearchChange,
  course,
  onCourseChange,
  company,
  onCompanyChange,
  attendance,
  onAttendanceChange,
  certificate,
  onCertificateChange,
  courseOptions = [],
  companyOptions = [],
  attendanceOptions = [],
  certificateOptions = [],
}) => {
  return (
    <SectionCard>
      <div className="admin-candidates-filter">
        <label className="admin-candidates-filter__search">
          <span className="admin-candidates-filter__label">Search</span>
          <input
            type="text"
            className="admin-candidates-filter__search-input"
            placeholder="Name or candidate Email ID ...."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </label>

        <Dropdown
          label="Course"
          options={courseOptions}
          value={course}
          onChange={onCourseChange}
        />

        <Dropdown
          label="Company"
          options={companyOptions}
          value={company}
          onChange={onCompanyChange}
        />

        <Dropdown
          label="Attendance"
          options={attendanceOptions}
          value={attendance}
          onChange={onAttendanceChange}
        />

        <Dropdown
          label="Certificates"
          options={certificateOptions}
          value={certificate}
          onChange={onCertificateChange}
        />
      </div>
    </SectionCard>
  );
};

export default CandidatesFilterBar;
