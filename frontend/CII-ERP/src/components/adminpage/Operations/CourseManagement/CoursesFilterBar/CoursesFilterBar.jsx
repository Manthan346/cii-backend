import React from "react";
import { Search, Filter } from "lucide-react";
import SectionCard from "../../../shared/SectionCard/SectionCard";
import Dropdown from "../../../shared/Dropdown/Dropdown";
import Button from "../../../shared/Button/Button";
import "./CoursesFilterBar.css";

/**
 * CoursesFilterBar
 *
 * Search + Mode + Company filters, plus the "Apply Filters" button,
 * for the Courses catalog table (backed by GET /admin/courses).
 *
 * Props:
 *  - search / onSearchChange
 *  - mode / onModeChange
 *  - company / onCompanyChange
 *  - modeOptions / companyOptions: array of { value, label }
 *  - onApply: function -> "Apply Filters" button
 */
const CoursesFilterBar = ({
  search,
  onSearchChange,
  mode,
  onModeChange,
  company,
  onCompanyChange,
  modeOptions = [],
  companyOptions = [],
  onApply,
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
          label="Mode"
          options={modeOptions}
          value={mode}
          onChange={onModeChange}
        />

        <Dropdown
          label="Company"
          options={companyOptions}
          value={company}
          onChange={onCompanyChange}
        />

        <div className="admin-courses-filter__apply">
          <Button icon={Filter} onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </SectionCard>
  );
};

export default CoursesFilterBar;
