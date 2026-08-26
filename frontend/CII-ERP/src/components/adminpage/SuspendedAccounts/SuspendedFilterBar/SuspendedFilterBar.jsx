import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import Dropdown from '../../shared/Dropdown/Dropdown';
import './SuspendedFilterBar.css';

/**
 * SuspendedFilterBar
 *
 * Compact Month / Years / Courses / Batch pill filters above the
 * Suspended Accounts table. Uses Dropdown's 'pill' variant (no label
 * caption, fully-rounded chip) rather than the boxed filter style
 * used on Total Users / Candidates.
 *
 * Props:
 *  - month / onMonthChange
 *  - year / onYearChange
 *  - course / onCourseChange
 *  - batch / onBatchChange
 *  - monthOptions / yearOptions / courseOptions / batchOptions:
 *    array of { value, label }
 */
const SuspendedFilterBar = ({
  month,
  onMonthChange,
  year,
  onYearChange,
  course,
  onCourseChange,
  batch,
  onBatchChange,
  monthOptions = [],
  yearOptions = [],
  courseOptions = [],
  batchOptions = [],
}) => {
  return (
    <SectionCard>
      <div className="admin-suspended-filter">
        <Dropdown
          variant="pill"
          options={monthOptions}
          value={month}
          onChange={onMonthChange}
        />
        <Dropdown
          variant="pill"
          options={yearOptions}
          value={year}
          onChange={onYearChange}
        />
        <Dropdown
          variant="pill"
          options={courseOptions}
          value={course}
          onChange={onCourseChange}
        />
        <Dropdown
          variant="pill"
          options={batchOptions}
          value={batch}
          onChange={onBatchChange}
        />
      </div>
    </SectionCard>
  );
};

export default SuspendedFilterBar;
