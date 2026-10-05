import React from "react";
import { Search } from "lucide-react";
import SectionCard from "../../../shared/SectionCard/SectionCard";
import Dropdown from "../../../shared/Dropdown/Dropdown";
import "./CoursesFilterBar.css";

/**
 * CoursesFilterBar
 *
 * Search, mode, and company filters for the Courses catalog table.
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

      </div>
    </SectionCard>
  );
};

export default CoursesFilterBar;
