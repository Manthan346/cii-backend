import React from 'react';
import { Search } from 'lucide-react';
import SectionCard from '../../../shared/SectionCard/SectionCard';
import Dropdown from '../../../shared/Dropdown/Dropdown';
import './CoursesFilterBar.css';

/**
 * CoursesFilterBar
 *
 * Search + Batches + Status + Course + Company filters for the
 * Courses catalog table. No submit button lives inside this card -
 * the page-level "Apply Filters" button sits above, next to the tabs
 * (see CourseManagement.jsx).
 *
 * Props:
 *  - search / onSearchChange
 *  - batch / onBatchChange
 *  - status / onStatusChange
 *  - course / onCourseChange
 *  - company / onCompanyChange
 *  - batchOptions / statusOptions / courseOptions / companyOptions:
 *    array of { value, label }
 */
const CoursesFilterBar = ({
  search,
  onSearchChange,
  batch,
  onBatchChange,
  status,
  onStatusChange,
  course,
  onCourseChange,
  company,
  onCompanyChange,
  batchOptions = [],
  statusOptions = [],
  courseOptions = [],
  companyOptions = [],
}) => {
  return (
    <SectionCard>
      <div className="admin-courses-filter">
        <label className="admin-courses-filter__search">
          <span className="admin-courses-filter__label">Search</span>
          <span className="admin-courses-filter__search-control">
            <Search size={16} className="admin-courses-filter__search-icon" />
            <input
              type="text"
              className="admin-courses-filter__search-input"
              placeholder="Search courses, classes..."
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </span>
        </label>

        <Dropdown
          label="Batches"
          options={batchOptions}
          value={batch}
          onChange={onBatchChange}
        />

        <Dropdown
          label="Status"
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
        />

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
      </div>
    </SectionCard>
  );
};

export default CoursesFilterBar;
